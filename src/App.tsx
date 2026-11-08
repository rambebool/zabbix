import { useState, useEffect, useCallback } from 'react';
import { Section, ZabbixItem } from './types';
import { initialData } from './data';

const STORAGE_KEY = 'zabbix-template-audit';

function loadData(): Section[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return initialData;
}

function saveData(data: Section[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

function generateId(): string {
  return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export default function App() {
  const [data, setData] = useState<Section[]>(loadData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormSection, setAddFormSection] = useState<string>('template');
  const [addFormGroup, setAddFormGroup] = useState<string>('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editNoteValue, setEditNoteValue] = useState('');
  const [showFlags, setShowFlags] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // New item form state
  const [newItem, setNewItem] = useState<Partial<ZabbixItem>>({
    name: '', key: '', type: 'агент', interval: '1m', status: 'active', note: '',
    hasTrigger: false, triggerNote: '', isMaster: false
  });

  useEffect(() => {
    saveData(data);
  }, [data]);

  // Initialize all groups as expanded
  useEffect(() => {
    const allGroups = new Set<string>();
    data.forEach(s => s.groups.forEach(g => allGroups.add(g.id)));
    setExpandedGroups(allGroups);
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const toggleStatus = useCallback((sectionId: string, groupId: string, itemId: string) => {
    setData(prev => prev.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        groups: section.groups.map(group => {
          if (group.id !== groupId) return group;
          return {
            ...group,
            items: group.items.map(item => {
              if (item.id !== itemId) return item;
              return { ...item, status: item.status === 'active' ? 'disabled' : 'active' };
            })
          };
        })
      };
    }));
  }, []);

  const deleteItem = useCallback((sectionId: string, groupId: string, itemId: string) => {
    if (!confirm('Удалить этот элемент?')) return;
    setData(prev => prev.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        groups: section.groups.map(group => {
          if (group.id !== groupId) return group;
          return { ...group, items: group.items.filter(item => item.id !== itemId) };
        })
      };
    }));
  }, []);

  const addItem = useCallback(() => {
    if (!newItem.name || !newItem.key) {
      alert('Заполните имя и ключ элемента');
      return;
    }
    const item: ZabbixItem = {
      id: generateId(),
      name: newItem.name || '',
      key: newItem.key || '',
      type: newItem.type || 'агент',
      interval: newItem.interval || '1m',
      status: newItem.status || 'active',
      note: newItem.note || '',
      hasTrigger: newItem.hasTrigger || false,
      triggerNote: newItem.triggerNote || '',
      isMaster: newItem.isMaster || false,
    };

    setData(prev => prev.map(section => {
      if (section.id !== addFormSection) return section;
      return {
        ...section,
        groups: section.groups.map(group => {
          if (group.id !== addFormGroup) return group;
          return { ...group, items: [...group.items, item] };
        })
      };
    }));

    setNewItem({ name: '', key: '', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: false, triggerNote: '', isMaster: false });
    setShowAddForm(false);
  }, [newItem, addFormSection, addFormGroup]);

  const updateNote = useCallback((sectionId: string, groupId: string, itemId: string) => {
    setData(prev => prev.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        groups: section.groups.map(group => {
          if (group.id !== groupId) return group;
          return {
            ...group,
            items: group.items.map(item => {
              if (item.id !== itemId) return item;
              return { ...item, note: editNoteValue };
            })
          };
        })
      };
    }));
    setEditingNote(null);
  }, [editNoteValue]);

  const resetData = () => {
    if (!confirm('Сбросить все изменения к начальным данным?')) return;
    setData(initialData);
    localStorage.removeItem(STORAGE_KEY);
  };

  const filterItem = (item: ZabbixItem): boolean => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) ||
        item.key.toLowerCase().includes(q) ||
        item.note.toLowerCase().includes(q);
    }
    return true;
  };

  // Calculate stats
  const stats = {
    templateActive: 0, templateDisabled: 0,
    prototypeActive: 0, prototypeDisabled: 0,
    totalGroups: 0, totalMasters: 0,
  };
  data.forEach(section => {
    section.groups.forEach(group => {
      stats.totalGroups++;
      group.items.forEach(item => {
        if (item.isMaster) stats.totalMasters++;
        if (section.id === 'template') {
          if (item.status === 'active') stats.templateActive++;
          else stats.templateDisabled++;
        } else {
          if (item.status === 'active') stats.prototypeActive++;
          else stats.prototypeDisabled++;
        }
      });
    });
  });

  const selectedSection = data.find(s => s.id === addFormSection);
  const availableGroups = selectedSection?.groups || [];

  return (
    <div className="min-h-screen bg-[#f7f9fc] p-4 md:p-6" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      {/* Header */}
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
          Шаблон <code className="bg-gray-100 px-2 py-0.5 rounded text-blue-700">windows_custom</code> — аудит элементов
        </h1>
        <p className="text-xs text-gray-500 mb-4">
          Zabbix 8.0 LTS, официальный шаблон Windows (passive-вариант) + ручные отключения. Источник: экспорт YAML.
        </p>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <input
            type="text"
            placeholder="🔍 Поиск по имени, ключу, примечанию..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="disabled">Отключённые</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">Все типы</option>
            <option value="агент">Агент</option>
            <option value="internal">Internal</option>
            <option value="зависимый">Зависимый</option>
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            + Добавить элемент
          </button>
          <button
            onClick={resetData}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            ↺ Сброс
          </button>
        </div>

        {/* Flags */}
        {showFlags && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm">
            <div className="flex justify-between items-start">
              <div>
                <b>Находки аудита:</b>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Цепочка TPM в экспорте <b>включена</b> (мастер + 6 элементов + триггер) — сверь с фактическим состоянием.</li>
                  <li>Мастера отключённых обнаружений (BitLocker, Scheduled tasks) <b>включены</b> — пустой WMI-опрос каждые 30m; рекомендуется погасить.</li>
                  <li>Все прямые элементы — <b>пассивные</b> проверки (тип Zabbix agent); active-вариант шаблона не использован.</li>
                </ul>
              </div>
              <button onClick={() => setShowFlags(false)} className="text-gray-400 hover:text-gray-600 text-lg ml-2">✕</button>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <b className="text-lg block">{stats.templateActive + stats.templateDisabled}</b>
            <span className="text-xs text-gray-600">элементов шаблона ({stats.templateActive} акт. / {stats.templateDisabled} откл.)</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <b className="text-lg block">{stats.prototypeActive + stats.prototypeDisabled}</b>
            <span className="text-xs text-gray-600">прототипов ({stats.prototypeActive} акт. / {stats.prototypeDisabled} откл.)</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <b className="text-lg block">{stats.totalGroups}</b>
            <span className="text-xs text-gray-600">групп / правил обнаружения</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <b className="text-lg block">{stats.totalMasters}</b>
            <span className="text-xs text-gray-600">мастеров (raw-слой)</span>
          </div>
        </div>

        {/* Legend */}
        <div className="text-xs text-gray-500 mb-4">
          Условные обозначения: <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">АКТИВЕН</span>{' '}
          <span className="bg-red-50 text-red-700 border border-red-200 rounded-full px-2 py-0.5">ОТКЛЮЧЁН</span>{' '}
          · <span className="text-purple-700 font-bold">МАСТЕР</span> — сырой источник данных{' '}
          · <span className="text-blue-600">зависимый</span> — питается от мастера{' '}
          · <span className="text-amber-700">⚑ триггер</span> — элемент участвует в триггере
        </div>

        {/* Sections */}
        {data.map(section => (
          <div key={section.id} className="mb-8">
            <h2 className="text-lg font-bold text-blue-700 mb-2">{section.title}</h2>
            {section.groups.map(group => {
              const filteredItems = group.items.filter(filterItem);
              if (filteredItems.length === 0 && (searchQuery || statusFilter !== 'all' || typeFilter !== 'all')) return null;
              const isExpanded = expandedGroups.has(group.id);

              return (
                <div key={group.id} className="mb-4">
                  {/* Group header */}
                  <div
                    className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-t-lg px-4 py-2 font-bold text-blue-900 text-sm cursor-pointer flex justify-between items-center"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <span>{group.name}</span>
                    <span className="text-xs text-blue-600 font-normal">
                      {filteredItems.length} эл. {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full bg-white text-xs border border-gray-200 rounded-b-lg shadow-sm">
                        <thead>
                          <tr className="bg-[#2c3e50] text-white">
                            <th className="px-2 py-1.5 text-left w-[22%]">Имя</th>
                            <th className="px-2 py-1.5 text-left w-[30%]">Ключ</th>
                            <th className="px-2 py-1.5 text-left w-[8%]">Тип</th>
                            <th className="px-2 py-1.5 text-left w-[6%]">Интервал</th>
                            <th className="px-2 py-1.5 text-left w-[9%]">Статус</th>
                            <th className="px-2 py-1.5 text-left w-[18%]">Примечание</th>
                            <th className="px-2 py-1.5 text-center w-[7%]">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item, idx) => (
                            <tr key={item.id} className={idx % 2 === 1 ? 'bg-blue-50/40' : ''}>
                              <td className="px-2 py-1.5 border-b border-gray-100 align-top">
                                {item.name}
                              </td>
                              <td className="px-2 py-1.5 border-b border-gray-100 align-top">
                                <code className="text-[11px] font-mono break-all text-gray-600">{item.key}</code>
                              </td>
                              <td className="px-2 py-1.5 border-b border-gray-100 align-top">
                                {item.type === 'зависимый' ? (
                                  <span className="text-blue-600 text-[11px]">зависимый</span>
                                ) : (
                                  <span>{item.type}</span>
                                )}
                              </td>
                              <td className="px-2 py-1.5 border-b border-gray-100 align-top">{item.interval}</td>
                              <td className="px-2 py-1.5 border-b border-gray-100 align-top">
                                <button
                                  onClick={() => toggleStatus(section.id, group.id, item.id)}
                                  className={`rounded-full px-2 py-0.5 text-[11px] whitespace-nowrap cursor-pointer transition-all hover:scale-105 ${
                                    item.status === 'active'
                                      ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                      : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                  }`}
                                  title="Нажмите для переключения статуса"
                                >
                                  {item.status === 'active' ? 'АКТИВЕН' : 'ОТКЛЮЧЁН'}
                                </button>
                              </td>
                              <td className="px-2 py-1.5 border-b border-gray-100 align-top">
                                {item.isMaster && <span className="text-purple-700 text-[11px] font-bold mr-1">МАСТЕР</span>}
                                {item.hasTrigger && <span className="text-amber-700 text-[11px] mr-1">⚑ {item.triggerNote}</span>}
                                {editingNote === item.id ? (
                                  <div className="flex gap-1">
                                    <input
                                      type="text"
                                      className="border border-blue-300 rounded px-1 py-0.5 text-[11px] w-full"
                                      value={editNoteValue}
                                      onChange={e => setEditNoteValue(e.target.value)}
                                      onKeyDown={e => { if (e.key === 'Enter') updateNote(section.id, group.id, item.id); }}
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => updateNote(section.id, group.id, item.id)}
                                      className="text-green-600 hover:text-green-800 text-xs"
                                    >✓</button>
                                    <button
                                      onClick={() => setEditingNote(null)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >✕</button>
                                  </div>
                                ) : (
                                  <span
                                    className="cursor-pointer hover:bg-yellow-50 rounded px-1 py-0.5 transition-colors"
                                    onClick={() => { setEditingNote(item.id); setEditNoteValue(item.note); }}
                                    title="Нажмите для редактирования"
                                  >
                                    {item.note || <span className="text-gray-300 italic">—</span>}
                                  </span>
                                )}
                              </td>
                              <td className="px-2 py-1.5 border-b border-gray-100 text-center align-top">
                                <button
                                  onClick={() => deleteItem(section.id, group.id, item.id)}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
                                  title="Удалить элемент"
                                >
                                  🗑
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8 mb-4 border-t pt-4">
          Конец аудита. Интервал «—» у зависимых элементов означает отсутствие собственного опроса (значение приходит от мастера).
          Данные сохраняются в localStorage браузера.
        </p>
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold mb-4">Добавить новый элемент</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Секция</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={addFormSection}
                  onChange={e => { setAddFormSection(e.target.value); setAddFormGroup(''); }}
                >
                  {data.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Группа</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={addFormGroup}
                  onChange={e => setAddFormGroup(e.target.value)}
                >
                  <option value="">— Выберите группу —</option>
                  {availableGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя элемента *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Например: CPU temperature"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ключ *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
                  value={newItem.key}
                  onChange={e => setNewItem({ ...newItem, key: e.target.value })}
                  placeholder="Например: perf_counter_en[...]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={newItem.type}
                    onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                  >
                    <option value="агент">агент</option>
                    <option value="internal">internal</option>
                    <option value="зависимый">зависимый</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Интервал</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={newItem.interval}
                    onChange={e => setNewItem({ ...newItem, interval: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Примечание</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={newItem.note}
                  onChange={e => setNewItem({ ...newItem, note: e.target.value })}
                />
              </div>

              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newItem.isMaster}
                    onChange={e => setNewItem({ ...newItem, isMaster: e.target.checked })}
                    className="rounded"
                  />
                  Мастер
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newItem.hasTrigger}
                    onChange={e => setNewItem({ ...newItem, hasTrigger: e.target.checked })}
                    className="rounded"
                  />
                  Есть триггер
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newItem.status === 'disabled'}
                    onChange={e => setNewItem({ ...newItem, status: e.target.checked ? 'disabled' : 'active' })}
                    className="rounded"
                  />
                  Отключён
                </label>
              </div>

              {newItem.hasTrigger && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание триггера</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={newItem.triggerNote}
                    onChange={e => setNewItem({ ...newItem, triggerNote: e.target.value })}
                    placeholder="Например: высокая температура (WARN)"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addItem}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Добавить
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
