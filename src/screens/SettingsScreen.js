import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen() {
  const { colors, t, theme, listView, language, updateTheme, updateListView, updateLanguage } = useSettings();

  const sectionStyle = [styles.section, { backgroundColor: colors.card, borderColor: colors.border }];
  const labelStyle = [styles.label, { color: colors.accent }];
  const textStyle = [styles.text, { color: colors.text }];

  const OptionButton = ({ label, active, onPress }) => (
    <TouchableOpacity
      style={[
        styles.optionBtn,
        { borderColor: active ? colors.accent : colors.border },
        active && { backgroundColor: colors.accent },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.optionBtnText, { color: active ? '#1B4332' : colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scroll}
    >
      {/* Thema */}
      <View style={sectionStyle}>
        <Text style={labelStyle}>🎨 {t.settings.theme}</Text>
        <View style={styles.optionRow}>
          <OptionButton
            label={t.settings.dark}
            active={theme === 'dark'}
            onPress={() => updateTheme('dark')}
          />
          <OptionButton
            label={t.settings.light}
            active={theme === 'light'}
            onPress={() => updateTheme('light')}
          />
        </View>
      </View>

      {/* Lijstweergave */}
      <View style={sectionStyle}>
        <Text style={labelStyle}>📋 {t.settings.listView}</Text>
        <View style={styles.optionRow}>
          <OptionButton
            label={t.settings.full}
            active={listView === 'full'}
            onPress={() => updateListView('full')}
          />
          <OptionButton
            label={t.settings.compact}
            active={listView === 'compact'}
            onPress={() => updateListView('compact')}
          />
        </View>
      </View>

      {/* Taal */}
      <View style={sectionStyle}>
        <Text style={labelStyle}>🌐 {t.settings.language}</Text>
        <View style={styles.optionRow}>
          <OptionButton
            label="Nederlands"
            active={language === 'nl'}
            onPress={() => updateLanguage('nl')}
          />
          <OptionButton
            label="English"
            active={language === 'en'}
            onPress={() => updateLanguage('en')}
          />
          <OptionButton
            label="Deutsch"
            active={language === 'de'}
            onPress={() => updateLanguage('de')}
          />
        </View>
      </View>

      {/* Over de app */}
      <View style={sectionStyle}>
        <Text style={labelStyle}>⛳ {t.settings.about}</Text>
        <Text style={[styles.aboutText, { color: colors.subtext }]}>{t.settings.aboutText}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 14,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  optionBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  optionBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
