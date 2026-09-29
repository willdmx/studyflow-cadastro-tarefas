// src/screens/TaskListScreen.js
// =============================================================================
// TELA DE CONSULTA, FILTRAGEM E MANIPULAÇÃO DE DADOS (DML VISUAL)
// =============================================================================

import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { Task } from '../models/Task';
import { colors } from '../styles/colors';

const filters = [
  { value: 'ALL', label: 'Todas' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'HIGH', label: 'Prioridade Alta' },
  { value: 'HIGH_PENDING', label: 'Alta + Pendente' },
  { value: 'COMPLETED', label: 'Concluídas' },
];

export default function TaskListScreen({ navigation }) {
  const [taskList, setTaskList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [errorMessage, setErrorMessage] = useState('');

  // Reconsulta o banco SQLite com base no filtro ativo
  const loadTasks = useCallback(() => {
    try {
      setErrorMessage('');
      let rows = [];

      // 1. SELECT * FROM tasks WHERE completed = 0
      if (activeFilter === 'PENDING') {
        rows = Task.filterByStatusLocal(false);
      }
      // 2. SELECT * FROM tasks WHERE completed = 1
      else if (activeFilter === 'COMPLETED') {
        rows = Task.filterByStatusLocal(true);
      }
      else if (activeFilter === 'HIGH') {
        rows = Task.filterByPriorityLocal('Alta');
      }
      else if (activeFilter === 'HIGH_PENDING') {
        rows = Task.filterHighPriorityPendingLocal();
      }
      // 3. SELECT * FROM tasks ORDER BY id DESC
      else {
        rows = Task.listAllLocal();
      }

      setTaskList(rows);
    } catch (error) {
      setTaskList([]);
      setErrorMessage(error.message);
    }
  }, [activeFilter]);

  // Executa na entrada, na troca do filtro e no retorno do formulário.
  useFocusEffect(loadTasks);

  // Altera o status da tarefa no banco (UPDATE)
  function handleToggleTask(item) {
    try {
      const taskInstance = new Task(
        item.title, item.category, item.description, item.priority,
        item.dueDate, item.completed, item.id
      );
      taskInstance.toggleStatusLocal();
      loadTasks();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  // Remove o registro do banco de dados (DELETE)
  function handleDeleteTask(item) {
    Alert.alert(
      'Remover Tarefa',
      `Deseja realmente excluir "${item.title}" do banco local?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            try {
              const taskInstance = new Task(
                item.title, item.category, item.description, item.priority,
                item.dueDate, item.completed, item.id
              );
              taskInstance.deleteLocal();
              loadTasks();
            } catch (error) {
              setErrorMessage(error.message);
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciador de Tarefas</Text>

      {/* Navega até a tela de formulário (INSERT) */}
      <PrimaryButton
        title="+ Nova Tarefa (INSERT)"
        onPress={() => navigation.navigate('TaskForm')}
      />

      {/* BARRA DE FILTROS: Altera a cláusula WHERE no banco */}
      <View style={styles.filterRow}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            accessibilityRole="button"
            accessibilityState={{ selected: activeFilter === filter.value }}
            style={[styles.filterChip, activeFilter === filter.value && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter.value)}
          >
            <Text style={[styles.filterText, activeFilter === filter.value && styles.filterTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* LISTAGEM DOS DADOS (SELECT) */}
      <FlatList
        data={taskList}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={errorMessage ? null : <Text style={styles.emptyText}>Nenhuma tarefa neste filtro.</Text>}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity
              style={styles.taskInfo}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}. ${item.completed ? 'Reabrir tarefa' : 'Concluir tarefa'}`}
              onPress={() => handleToggleTask(item)}
            >
              <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
                {item.completed ? '✓ ' : '○ '} {item.title}
              </Text>
              <Text style={styles.taskCategory}>Categoria: {item.category}</Text>
              <Text style={styles.taskDescription}>{item.description || 'Sem descrição'}</Text>
              <Text style={styles.taskDetail}>Prioridade: {item.priority}</Text>
              <Text style={styles.taskDetail}>Entrega: {item.dueDate || 'Não informada'}</Text>
              <Text style={styles.taskStatus}>Status: {item.completed ? 'Concluída' : 'Pendente'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              accessibilityRole="button"
              accessibilityLabel={`Excluir tarefa ${item.title}`}
              onPress={() => handleDeleteTask(item)}
            >
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backText}>Voltar para a Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background, gap: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 20 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 },
  filterChip: {
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { color: colors.text, fontWeight: '700', fontSize: 12 },
  filterTextActive: { color: colors.surface },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  completedText: { textDecorationLine: 'line-through', opacity: 0.5 },
  taskCategory: { fontSize: 12, color: colors.textLight, marginTop: 4 },
  taskDescription: { fontSize: 14, color: colors.text, marginVertical: 8 },
  taskDetail: { fontSize: 13, color: colors.textLight, marginTop: 4 },
  taskStatus: { fontSize: 13, color: colors.primary, fontWeight: '600', marginTop: 8 },
  emptyText: { color: colors.textLight, textAlign: 'center', paddingVertical: 24 },
  deleteButton: { padding: 12 },
  deleteText: { fontSize: 18 },
  errorText: { color: colors.error || '#FF3B30', textAlign: 'center' },
  backButton: { paddingVertical: 12, alignItems: 'center' },
  backText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
});
