import { StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';

export default function ProgressBar({ percentage }) {
  const progress = typeof percentage === 'number' && !Number.isNaN(percentage)
    ? Math.max(0, Math.min(percentage, 100))
    : 0;
  const progressColor = progress < 30
    ? colors.danger
    : progress < 70
      ? colors.warning
      : colors.success;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Progresso das tarefas"
      accessibilityValue={{ min: 0, max: 100, now: progress, text: `${progress}% concluído` }}
      style={styles.track}
    >
      <View
        style={[
          styles.fill,
          { width: `${progress}%`, backgroundColor: progressColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
});
