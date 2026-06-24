import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { Share } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useGame } from '../context/GameContext';
import { fetchHoles } from '../services/api';
import ScoreRow from '../components/ScoreRow';

export default function ScorecardScreen() {
  const { colors, t } = useSettings();
  const { players, scores, gameActive, startGame, resetGame, getTotalScore } = useGame();
  const [holes, setHoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerInputs, setPlayerInputs] = useState(['', '']);

  useEffect(() => {
    fetchHoles().then(({ holes: h }) => setHoles(h));
  }, []);

  const sortedPlayers = [...players].sort((a, b) => getTotalScore(a) - getTotalScore(b));
  const winner = sortedPlayers[0];

  const handleStartGame = () => {
    const names = playerInputs.map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) {
      Alert.alert('', t.scorecard.minPlayers);
      return;
    }
    startGame(names);
    setModalVisible(false);
    setPlayerInputs(['', '']);
  };

  const handleResetGame = () => {
    Alert.alert(t.scorecard.resetGame, '', [
      { text: t.scorecard.cancel, style: 'cancel' },
      { text: 'OK', onPress: resetGame, style: 'destructive' },
    ]);
  };

  const handleShare = async () => {
    const lines = players.map((p) => {
      const total = getTotalScore(p);
      return `${p}: ${total || 0} slokken`;
    });
    const text = t.scorecard.shareText
      .replace('{scores}', lines.join('\n'))
      .replace('{winner}', winner || '—');
    await Share.share({ message: text, title: t.scorecard.title });
  };

  const addPlayerInput = () => {
    if (playerInputs.length < 6) {
      setPlayerInputs([...playerInputs, '']);
    }
  };

  const updatePlayerInput = (index, value) => {
    const updated = [...playerInputs];
    updated[index] = value;
    setPlayerInputs(updated);
  };

  const totalPar = holes.reduce((s, h) => s + h.par, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Actieknoppen */}
      <View style={[styles.actionRow, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.accent }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.actionBtnText, { color: '#1B4332' }]}>
            {gameActive ? '+ ' + t.scorecard.newGame : t.scorecard.newGame}
          </Text>
        </TouchableOpacity>
        {gameActive && (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={handleShare}
            >
              <Text style={styles.actionBtnText}>↑ {t.scorecard.shareScorecard}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.danger }]}
              onPress={handleResetGame}
            >
              <Text style={styles.actionBtnText}>{t.scorecard.resetGame}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {!gameActive ? (
        <View style={styles.emptyState}>
          <Text style={styles.golfEmoji}>⛳</Text>
          <Text style={[styles.emptyText, { color: colors.subtext }]}>{t.scorecard.noGame}</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ScrollView>
            {/* Winnaar banner */}
            {winner && getTotalScore(winner) > 0 && (
              <View style={[styles.winnerBanner, { backgroundColor: colors.accent }]}>
                <Text style={styles.winnerText}>
                  🏆 {t.scorecard.winner.replace('{name}', winner)}
                </Text>
              </View>
            )}

            {/* Header rij */}
            <View style={[styles.headerRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <Text style={[styles.headerPlayer, { color: colors.subtext }]}>Speler</Text>
              {holes.map((h) => (
                <Text key={h.id} style={[styles.headerHole, { color: colors.accent }]}>
                  {t.scorecard.hole}{h.hole}
                </Text>
              ))}
              <Text style={[styles.headerTotal, { color: colors.text }]}>{t.scorecard.total}</Text>
            </View>

            {/* Par rij */}
            <View style={[styles.parRow, { backgroundColor: colors.cardAlt, borderBottomColor: colors.border }]}>
              <Text style={[styles.parRowLabel, { color: colors.subtext }]}>{t.scorecard.par}</Text>
              {holes.map((h) => (
                <Text key={h.id} style={[styles.parCell, { color: colors.subtext }]}>{h.par}</Text>
              ))}
              <Text style={[styles.parTotal, { color: colors.subtext }]}>{totalPar}</Text>
            </View>

            {/* Speler rijen */}
            {sortedPlayers.map((player, i) => (
              <ScoreRow
                key={player}
                playerName={player}
                scores={scores[player] || {}}
                holes={holes}
                isFirst={i === 0 && getTotalScore(player) > 0}
              />
            ))}
          </ScrollView>
        </ScrollView>
      )}

      {/* Modal: nieuw spel */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t.scorecard.addPlayers}</Text>
            {playerInputs.map((val, i) => (
              <TextInput
                key={i}
                style={[styles.playerInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                value={val}
                onChangeText={(v) => updatePlayerInput(i, v)}
                placeholder={t.scorecard.playerName.replace('{n}', i + 1)}
                placeholderTextColor={colors.subtext}
              />
            ))}
            {playerInputs.length < 6 && (
              <TouchableOpacity onPress={addPlayerInput}>
                <Text style={[styles.addPlayerText, { color: colors.accent }]}>
                  {t.scorecard.addPlayer}
                </Text>
              </TouchableOpacity>
            )}
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleStartGame}
              >
                <Text style={styles.modalBtnText}>{t.scorecard.startGame}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.danger }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>{t.scorecard.cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    borderBottomWidth: 1,
    flexWrap: 'wrap',
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  golfEmoji: {
    fontSize: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  winnerBanner: {
    padding: 10,
    alignItems: 'center',
  },
  winnerText: {
    color: '#1B4332',
    fontWeight: '800',
    fontSize: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  headerPlayer: {
    width: 80,
    fontSize: 11,
    fontWeight: '700',
    paddingLeft: 4,
  },
  headerHole: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    minWidth: 30,
  },
  headerTotal: {
    width: 48,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
  },
  parRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  parRowLabel: {
    width: 80,
    fontSize: 11,
    fontStyle: 'italic',
    paddingLeft: 4,
  },
  parCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    minWidth: 30,
  },
  parTotal: {
    width: 48,
    textAlign: 'center',
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  playerInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  addPlayerText: {
    fontWeight: '700',
    fontSize: 14,
    paddingVertical: 4,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
