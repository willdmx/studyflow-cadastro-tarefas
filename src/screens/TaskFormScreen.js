// src/screens/TaskFormScreen.js
// =============================================================================
// TELA DE CADASTRO DE TAREFAS (FORMULÁRIO DML INSERT)
// =============================================================================

import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { Task } from '../models/Task';
import { colors } from '../styles/colors';

export default function TaskFormScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Média');
  const [dueDate, setDueDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleDueDateChange(value) {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 4) {
      setDueDate(`${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`);
    } else if (digits.length > 2) {
      setDueDate(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setDueDate(digits);
    }
  }

  // Executa a inserção no banco de dados local
  function handleSaveTask() {
    try {
      setErrorMessage('');

      // Instancia e valida a tarefa
      const newTask = new Task(title, category, description, priority, dueDate);

      // Executa o INSERT INTO no SQLite
      newTask.saveLocal();

      // A listagem reconsulta o filtro ativo quando recupera o foco.
      navigation.goBack();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Nova Tarefa</Text>
          <Text style={styles.subtitle}>Cadastre uma atividade no banco local SQLite.</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Título da Tarefa *"
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Estudar comandos DML no SQLite"
          />

          <InputField
            label="Categoria *"
            value={category}
            onChangeText={setCategory}
            placeholder="Ex: Faculdade, Trabalho, Pessoal"
          />

          <InputField
            label="Descrição (opcional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva a atividade"
            multiline
            numberOfLines={4}
          />

          <View style={styles.priorityField}>
            <Text style={styles.label}>Prioridade *</Text>
            <View style={styles.priorityRow} accessibilityRole="radiogroup">
              {['Baixa', 'Média', 'Alta'].map((option) => (
                <TouchableOpacity
                  key={option}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: priority === option }}
                  onPress={() => setPriority(option)}
                  style={[styles.priorityChip, priority === option && styles.priorityChipActive]}
                >
                  <Text style={[styles.priorityText, priority === option && styles.priorityTextActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <InputField
            label="Data de entrega *"
            value={dueDate}
            onChangeText={handleDueDateChange}
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            maxLength={10}
          />

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <PrimaryButton title="Salvar Tarefa" onPress={handleSaveTask} />

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardArea: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 24 },
  header: { alignItems: 'center', gap: 6 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  subtitle: { color: colors.textLight, fontSize: 14, textAlign: 'center' },
  form: { gap: 16 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600' },
  priorityField: { gap: 8 },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityChip: {
    flex: 1,
    minHeight: 48,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  priorityText: { color: colors.text, fontWeight: '600' },
  priorityTextActive: { color: colors.surface },
  errorContainer: {
    backgroundColor: '#FFEBEB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error || '#FF3B30',
  },
  errorText: { color: colors.error || '#FF3B30', fontSize: 14, textAlign: 'center' },
  cancelButton: { paddingVertical: 10, alignItems: 'center' },
  cancelText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
});
