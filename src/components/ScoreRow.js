import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function ScoreRow({ playerName, scores, holes, isFirst }) {
  const { colors } = useSettings();

  const totalScore = Object.values(scores).reduce((sum, s) => sum + (s || 0), 0);
  const totalPar = holes.reduce((sum, h) => sum + h.par, 0);
  const diff = totalScore - totalPar;

  return (
    <View style={[styles.row, { borderBottomColor: colors.border, backgroundColor: isFirst ? colors.cardAlt : 'transparent' }]}>
      <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
        {playerName}
        {isFirst ? ' 🏆' : ''}
      </Text>
      {holes.map((hole) => {
        const sips = scores[hole.id];
        const cellColor =
          sips === undefined
            ? colors.subtext
            : sips < hole.par
            ? colors.underPar
            : sips > hole.par
            ? colors.overPar
            : colors.atPar;

        return (
          <View key={hole.id} style={styles.cell}>
            <Text style={[styles.scoreText, { color: cellColor }]}>
              {sips !== undefined ? sips : '–'}
            </Text>
          </View>
        );
      })}
      <View style={[styles.totalCell, { backgroundColor: colors.primary }]}>
        <Text style={styles.totalText}>{totalScore || '–'}</Text>
        {totalScore > 0 && (
          <Text style={[styles.diffText, { color: diff < 0 ? '#52B788' : diff > 0 ? '#E63946' : '#D4AF37' }]}>
            {diff > 0 ? `+${diff}` : diff}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  playerName: {
    width: 80,
    fontSize: 12,
    fontWeight: '600',
    paddingLeft: 4,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
  },
  totalCell: {
    width: 48,
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 4,
    marginLeft: 4,
  },
  totalText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  diffText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
