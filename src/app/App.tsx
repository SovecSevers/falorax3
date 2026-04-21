import { useState, useEffect } from 'react';
import { Plus, Trash2, X, User, MapPin, Calendar, Users, Edit2, Save, Share2, Lock, LogOut, Menu } from 'lucide-react';
import logo from '../imports/image.png';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface Clan {
  id: string;
  name: string;
  leader: string;
  members: string[];
  logo: string;
  baseCoordinates: string;
  basePhoto: string;
  foundedDate: string;
  description: string;
}

interface City {
  id: string;
  name: string;
  mayor: string;
  residents: string[];
  coordinates: string;
  photo: string;
  foundedDate: string;
  description: string;
}

interface Permissions {
  adminPassword: string;
  editors: string[];
}

type Tab = 'clans' | 'cities';

interface MemberInputProps {
  members: string[];
  onChange: (members: string[]) => void;
  placeholder: string;
}

function MemberInput({ members, onChange, placeholder }: MemberInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!members.includes(inputValue.trim())) {
        onChange([...members, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeMember = (index: number) => {
    onChange(members.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
      />
      {members.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {members.map((member, idx) => (
            <span
              key={idx}
              className="bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] px-3 py-2 rounded-full flex items-center gap-2 text-sm min-h-[36px]"
            >
              {member}
              <button
                onClick={() => removeMember(idx)}
                className="text-[#00D9FF] hover:text-[#EF4444] transition-colors p-1"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface ClanCardProps {
  clan: Clan;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Clan>) => void;
  canEdit: boolean;
}

function ClanCard({ clan, onDelete, onUpdate, canEdit }: ClanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(clan);
  const visibleMembers = clan.members.slice(0, 5);
  const remainingCount = clan.members.length - 5;

  const handleSave = () => {
    onUpdate(clan.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(clan);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-[#151922] border border-[#00D9FF]/30 rounded-xl p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Редактирование клана</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Название клана"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
          <input
            type="text"
            placeholder="Глава клана"
            value={editData.leader}
            onChange={(e) => setEditData({ ...editData, leader: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
          <MemberInput
            members={editData.members}
            onChange={(members) => setEditData({ ...editData, members })}
            placeholder="Участники (нажмите Enter после каждого ника)"
          />
          <input
            type="text"
            placeholder="URL логотипа"
            value={editData.logo}
            onChange={(e) => setEditData({ ...editData, logo: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
          <input
            type="text"
            placeholder="Координаты базы"
            value={editData.baseCoordinates}
            onChange={(e) => setEditData({ ...editData, baseCoordinates: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
          <input
            type="text"
            placeholder="URL фото базы"
            value={editData.basePhoto}
            onChange={(e) => setEditData({ ...editData, basePhoto: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
          <input
            type="date"
            value={editData.foundedDate}
            onChange={(e) => setEditData({ ...editData, foundedDate: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all min-h-[44px]"
          />
          <input
            type="text"
            placeholder="Описание"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
          >
            <Save size={18} />
            Сохранить
          </button>
          <button
            onClick={handleCancel}
            className="bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
          >
            Отмена
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#151922] border border-white/8 rounded-xl p-4 sm:p-6 space-y-4 hover:border-[#00D9FF]/20 transition-all">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
          {clan.logo ? (
            <img
              src={clan.logo}
              alt={clan.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-white/8 flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#1E2430] border border-white/8 rounded-lg flex items-center justify-center text-[#6B7280] text-xl sm:text-2xl font-semibold flex-shrink-0">
              {clan.name.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight break-words">{clan.name}</h3>
              <span className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0">
                Активен
              </span>
            </div>
            {clan.description && (
              <p className="text-sm text-[#B4BFCD] leading-relaxed break-words">{clan.description}</p>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="flex gap-2 self-start">
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#6B7280] hover:text-[#00D9FF] transition-colors p-2 hover:bg-[#00D9FF]/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(clan.id)}
              className="text-[#6B7280] hover:text-[#EF4444] transition-colors p-2 hover:bg-[#EF4444]/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User size={16} className="text-[#6B7280] flex-shrink-0" />
            <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wide">Глава</span>
            <span className="text-[#00D9FF] font-medium break-words">{clan.leader}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-[#6B7280] flex-shrink-0" />
            <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wide">Основан</span>
            <span className="text-[#B4BFCD] text-xs sm:text-sm">{new Date(clan.foundedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-[#6B7280] flex-shrink-0" />
            <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wide">База</span>
            <span className="text-[#B4BFCD] font-mono text-xs break-all">{clan.baseCoordinates}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users size={16} className="text-[#6B7280] flex-shrink-0" />
            <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wide">Участников</span>
            <span className="text-[#B4BFCD]">{clan.members.length}</span>
          </div>
        </div>
      </div>

      {clan.members.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {visibleMembers.map((member, idx) => (
            <span
              key={idx}
              className="bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] px-3 py-1 rounded-full text-xs font-medium break-words"
            >
              {member}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="bg-[#1E2430] border border-white/8 text-[#6B7280] px-3 py-1 rounded-full text-xs font-medium">
              +{remainingCount} ещё
            </span>
          )}
        </div>
      )}

      {clan.basePhoto && (
        <div className="pt-2">
          <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wide mb-2">Фото базы</p>
          <div className="relative rounded-lg overflow-hidden border border-white/8">
            <img
              src={clan.basePhoto}
              alt="База клана"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}

interface CityCardProps {
  city: City;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<City>) => void;
  canEdit: boolean;
}

function CityCard({ city, onDelete, onUpdate, canEdit }: CityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(city);
  const visibleResidents = city.residents.slice(0, 5);
  const remainingCount = city.residents.length - 5;

  const handleSave = () => {
    onUpdate(city.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(city);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-[#151922] border border-[#00D9FF]/30 rounded-xl p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Редактирование города</h3>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Название города"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
          <input
            type="text"
            placeholder="Мэр города"
            value={editData.mayor}
            onChange={(e) => setEditData({ ...editData, mayor: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
          <MemberInput
            members={editData.residents}
            onChange={(residents) => setEditData({ ...editData, residents })}
            placeholder="Жители (нажмите Enter после каждого ника)"
          />
          <input
            type="text"
            placeholder="Координаты"
            value={editData.coordinates}
            onChange={(e) => setEditData({ ...editData, coordinates: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
          <input
            type="text"
            placeholder="URL фото города"
            value={editData.photo}
            onChange={(e) => setEditData({ ...editData, photo: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
          <input
            type="date"
            value={editData.foundedDate}
            onChange={(e) => setEditData({ ...editData, foundedDate: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all min-h-[44px]"
          />
          <input
            type="text"
            placeholder="Описание"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
          >
            <Save size={18} />
            Сохранить
          </button>
          <button
            onClick={handleCancel}
            className="bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
          >
            Отмена
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#151922] border border-white/8 rounded-xl p-4 sm:p-6 space-y-4 hover:border-[#00D9FF]/20 transition-all">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight break-words">{city.name}</h3>
            <span className="bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0">
              Активен
            </span>
          </div>
          {city.description && (
            <p className="text-sm text-[#B4BFCD] leading-relaxed break-words">{city.description}</p>
          )}
        </div>

        {canEdit && (
          <div className="flex gap-2 self-start">
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#6B7280] hover:text-[#00D9FF] transition-colors p-2 hover:bg-[#00D9FF]/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(city.id)}
              className="text-[#6B7280] hover:text-[#EF4444] transition-colors p-2 hover:bg-[#EF4444]/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User size={16} className="text-[#6B7280] flex-shrink-0" />
            <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wide">Мэр</span>
            <span className="text-[#00D9FF] font-medium break-words">{city.mayor}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-[#6B7280] flex-shrink-0" />
            <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wide">Основан</span>
            <span className="text-[#B4BFCD] text-xs sm:text-sm">{new Date(city.foundedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-[#6B7280] flex-shrink-0" />
            <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wide">Координаты</span>
            <span className="text-[#B4BFCD] font-mono text-xs break-all">{city.coordinates}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users size={16} className="text-[#6B7280] flex-shrink-0" />
            <span className="text-[#6B7280] text-xs font-medium uppercase tracking-wide">Жителей</span>
            <span className="text-[#B4BFCD]">{city.residents.length}</span>
          </div>
        </div>
      </div>

      {city.residents.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {visibleResidents.map((resident, idx) => (
            <span
              key={idx}
              className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#7C3AED] px-3 py-1 rounded-full text-xs font-medium break-words"
            >
              {resident}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="bg-[#1E2430] border border-white/8 text-[#6B7280] px-3 py-1 rounded-full text-xs font-medium">
              +{remainingCount} ещё
            </span>
          )}
        </div>
      )}

      {city.photo && (
        <div className="pt-2">
          <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wide mb-2">Фото города</p>
          <div className="relative rounded-lg overflow-hidden border border-white/8">
            <img
              src={city.photo}
              alt="Город"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-96bf23b4`;

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('clans');
  const [clans, setClans] = useState<Clan[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [permissions, setPermissions] = useState<Permissions>({ adminPassword: 'admin123', editors: [] });
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [newEditorUsername, setNewEditorUsername] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newClan, setNewClan] = useState<Partial<Clan>>({
    name: '',
    leader: '',
    members: [],
    logo: '',
    baseCoordinates: '',
    basePhoto: '',
    foundedDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [newCity, setNewCity] = useState<Partial<City>>({
    name: '',
    mayor: '',
    residents: [],
    coordinates: '',
    photo: '',
    foundedDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    loadData();
    loadPermissions();

    // Check localStorage for saved auth
    const savedUsername = localStorage.getItem('vanillix_username');
    const savedAuth = localStorage.getItem('vanillix_auth');
    if (savedUsername && savedAuth === 'true') {
      setUsername(savedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  const loadPermissions = async () => {
    try {
      const response = await fetch(`${API_URL}/permissions`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (response.ok) {
        const perms = await response.json();
        setPermissions(perms);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  // FIXED: Admin can always edit, editors can edit if in the list
  const canEdit = () => {
    if (!isAuthenticated || !username) return false;

    // Admin always has edit rights
    if (username === 'admin') return true;

    // Check if user is in editors list
    return permissions.editors.includes(username);
  };

  const isAdmin = () => {
    return isAuthenticated && username === 'admin';
  };

  const getUserRole = () => {
    if (!isAuthenticated) return 'Гость';
    if (username === 'admin') return 'Админ';
    if (permissions.editors.includes(username)) return 'Редактор';
    return 'Гость';
  };

  const handleLogin = () => {
    if (username === 'admin' && password === permissions.adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('vanillix_username', username);
      localStorage.setItem('vanillix_auth', 'true');
      setShowLogin(false);
      setPassword('');
    } else if (permissions.editors.includes(username)) {
      setIsAuthenticated(true);
      localStorage.setItem('vanillix_username', username);
      localStorage.setItem('vanillix_auth', 'true');
      setShowLogin(false);
      setPassword('');
    } else {
      alert('Неверное имя пользователя или пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    localStorage.removeItem('vanillix_username');
    localStorage.removeItem('vanillix_auth');
  };

  const addEditor = async () => {
    if (!newEditorUsername.trim()) return;

    const updatedEditors = [...permissions.editors, newEditorUsername.trim()];
    const updatedPermissions = { ...permissions, editors: updatedEditors };

    try {
      const response = await fetch(`${API_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(updatedPermissions)
      });

      if (response.ok) {
        setPermissions(updatedPermissions);
        setNewEditorUsername('');
      }
    } catch (error) {
      console.error('Error adding editor:', error);
      alert('Ошибка при добавлении редактора');
    }
  };

  const removeEditor = async (editorUsername: string) => {
    const updatedEditors = permissions.editors.filter(e => e !== editorUsername);
    const updatedPermissions = { ...permissions, editors: updatedEditors };

    try {
      const response = await fetch(`${API_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(updatedPermissions)
      });

      if (response.ok) {
        setPermissions(updatedPermissions);
      }
    } catch (error) {
      console.error('Error removing editor:', error);
      alert('Ошибка при удалении редактора');
    }
  };

  const loadData = async () => {
    try {
      const [clansRes, citiesRes] = await Promise.all([
        fetch(`${API_URL}/clans`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }),
        fetch(`${API_URL}/cities`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        })
      ]);

      if (clansRes.ok) {
        const clansData = await clansRes.json();
        setClans(clansData);
      }

      if (citiesRes.ok) {
        const citiesData = await citiesRes.json();
        setCities(citiesData);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const addClan = async () => {
    if (!newClan.name || !newClan.leader) return;

    const clan: Clan = {
      id: Date.now().toString(),
      name: newClan.name,
      leader: newClan.leader,
      members: newClan.members || [],
      logo: newClan.logo || '',
      baseCoordinates: newClan.baseCoordinates || '',
      basePhoto: newClan.basePhoto || '',
      foundedDate: newClan.foundedDate || new Date().toISOString().split('T')[0],
      description: newClan.description || ''
    };

    try {
      const response = await fetch(`${API_URL}/clans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(clan)
      });

      if (response.ok) {
        setClans([...clans, clan]);
        setNewClan({
          name: '',
          leader: '',
          members: [],
          logo: '',
          baseCoordinates: '',
          basePhoto: '',
          foundedDate: new Date().toISOString().split('T')[0],
          description: ''
        });
        setIsAddingNew(false);
      } else {
        alert('Ошибка при добавлении клана');
      }
    } catch (error) {
      console.error('Error adding clan:', error);
      alert('Ошибка при добавлении клана');
    }
  };

  const updateClan = async (id: string, updates: Partial<Clan>) => {
    try {
      const response = await fetch(`${API_URL}/clans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setClans(clans.map(clan => clan.id === id ? { ...clan, ...updates } : clan));
      } else {
        alert('Ошибка при обновлении клана');
      }
    } catch (error) {
      console.error('Error updating clan:', error);
      alert('Ошибка при обновлении клана');
    }
  };

  const addCity = async () => {
    if (!newCity.name || !newCity.mayor) return;

    const city: City = {
      id: Date.now().toString(),
      name: newCity.name,
      mayor: newCity.mayor,
      residents: newCity.residents || [],
      coordinates: newCity.coordinates || '',
      photo: newCity.photo || '',
      foundedDate: newCity.foundedDate || new Date().toISOString().split('T')[0],
      description: newCity.description || ''
    };

    try {
      const response = await fetch(`${API_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(city)
      });

      if (response.ok) {
        setCities([...cities, city]);
        setNewCity({
          name: '',
          mayor: '',
          residents: [],
          coordinates: '',
          photo: '',
          foundedDate: new Date().toISOString().split('T')[0],
          description: ''
        });
        setIsAddingNew(false);
      } else {
        alert('Ошибка при добавлении города');
      }
    } catch (error) {
      console.error('Error adding city:', error);
      alert('Ошибка при добавлении города');
    }
  };

  const updateCity = async (id: string, updates: Partial<City>) => {
    try {
      const response = await fetch(`${API_URL}/cities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setCities(cities.map(city => city.id === id ? { ...city, ...updates } : city));
      } else {
        alert('Ошибка при обновлении города');
      }
    } catch (error) {
      console.error('Error updating city:', error);
      alert('Ошибка при обновлении города');
    }
  };

  const deleteClan = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот клан?')) return;

    try {
      const response = await fetch(`${API_URL}/clans/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        setClans(clans.filter(clan => clan.id !== id));
      } else {
        alert('Ошибка при удалении клана');
      }
    } catch (error) {
      console.error('Error deleting clan:', error);
      alert('Ошибка при удалении клана');
    }
  };

  const deleteCity = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот город?')) return;

    try {
      const response = await fetch(`${API_URL}/cities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        setCities(cities.filter(city => city.id !== id));
      } else {
        alert('Ошибка при удалении города');
      }
    } catch (error) {
      console.error('Error deleting city:', error);
      alert('Ошибка при удалении города');
    }
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована в буфер обмена!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E14] text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00D9FF]/20 border-t-[#00D9FF] rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-[#B4BFCD] text-sm font-medium tracking-wide">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E14] text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00D9FF]/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-6">
              <img src={logo} alt="Vanillix" className="w-10 h-10 sm:w-12 sm:h-12" />
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Vanillix</h1>
                <p className="text-[#B4BFCD] text-xs sm:text-sm mt-1 hidden sm:block">Управление кланами и городами на сервере</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Role Badge */}
              {isAuthenticated && (
                <div className="bg-[#1E2430] border border-white/8 px-3 py-2 rounded-lg">
                  <span className="text-[#00D9FF] text-sm font-medium">{getUserRole()}: {username}</span>
                </div>
              )}

              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-4 py-2 rounded-lg font-medium transition-all min-h-[44px]"
              >
                <Share2 size={18} />
                <span className="hidden lg:inline">Поделиться</span>
              </button>

              {isAuthenticated ? (
                <>
                  {isAdmin() && (
                    <button
                      onClick={() => setShowPermissionsModal(true)}
                      className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white px-4 py-2 rounded-lg font-medium transition-all min-h-[44px]"
                    >
                      <Lock size={18} />
                      <span className="hidden lg:inline">Права</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-4 py-2 rounded-lg font-medium transition-all min-h-[44px]"
                  >
                    <LogOut size={18} />
                    <span className="hidden lg:inline">Выйти</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-4 py-2 rounded-lg font-medium transition-all min-h-[44px]"
                >
                  <Lock size={18} />
                  Войти
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mb-6 bg-[#151922] border border-white/8 rounded-lg p-4 space-y-3">
              {isAuthenticated && (
                <div className="bg-[#1E2430] border border-white/8 px-3 py-2 rounded-lg text-center">
                  <span className="text-[#00D9FF] text-sm font-medium">{getUserRole()}: {username}</span>
                </div>
              )}

              <button
                onClick={() => {
                  setShowShareModal(true);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-4 py-3 rounded-lg font-medium transition-all min-h-[44px]"
              >
                <Share2 size={18} />
                Поделиться
              </button>

              {isAuthenticated ? (
                <>
                  {isAdmin() && (
                    <button
                      onClick={() => {
                        setShowPermissionsModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white px-4 py-3 rounded-lg font-medium transition-all min-h-[44px]"
                    >
                      <Lock size={18} />
                      Права доступа
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-4 py-3 rounded-lg font-medium transition-all min-h-[44px]"
                  >
                    <LogOut size={18} />
                    Выйти
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-4 py-3 rounded-lg font-medium transition-all min-h-[44px]"
                >
                  <Lock size={18} />
                  Войти
                </button>
              )}
            </div>
          )}

          {/* Tabs + Add Button */}
          <div className="sticky top-0 bg-[#0A0E14] z-10 pb-4 mb-6 border-b border-white/8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex gap-1 overflow-x-auto">
                <button
                  onClick={() => {
                    setActiveTab('clans');
                    setIsAddingNew(false);
                  }}
                  className={`px-4 sm:px-6 py-3 font-medium tracking-wide transition-all rounded-lg whitespace-nowrap min-h-[44px] ${
                    activeTab === 'clans'
                      ? 'bg-[#1E2430] text-white border border-white/8'
                      : 'text-[#6B7280] hover:text-white hover:bg-[#1E2430]/50'
                  }`}
                >
                  Кланы
                </button>
                <button
                  onClick={() => {
                    setActiveTab('cities');
                    setIsAddingNew(false);
                  }}
                  className={`px-4 sm:px-6 py-3 font-medium tracking-wide transition-all rounded-lg whitespace-nowrap min-h-[44px] ${
                    activeTab === 'cities'
                      ? 'bg-[#1E2430] text-white border border-white/8'
                      : 'text-[#6B7280] hover:text-white hover:bg-[#1E2430]/50'
                  }`}
                >
                  Города
                </button>
              </div>

              {canEdit() && (
                <button
                  onClick={() => setIsAddingNew(!isAddingNew)}
                  className="flex items-center justify-center gap-2 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-4 sm:px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-[#00D9FF]/20 min-h-[44px] whitespace-nowrap"
                >
                  <Plus size={20} />
                  {activeTab === 'clans' ? 'Добавить клан' : 'Добавить город'}
                </button>
              )}
            </div>
          </div>

          {/* Add Clan Form */}
          {isAddingNew && activeTab === 'clans' && (
            <div className="bg-[#151922] border border-white/8 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl">
              <h3 className="text-lg font-semibold mb-6">Создать новый клан</h3>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
                <input
                  type="text"
                  placeholder="Название клана *"
                  value={newClan.name}
                  onChange={(e) => setNewClan({ ...newClan, name: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <input
                  type="text"
                  placeholder="Глава клана *"
                  value={newClan.leader}
                  onChange={(e) => setNewClan({ ...newClan, leader: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <MemberInput
                  members={newClan.members || []}
                  onChange={(members) => setNewClan({ ...newClan, members })}
                  placeholder="Участники (нажмите Enter после каждого ника)"
                />
                <input
                  type="text"
                  placeholder="URL логотипа"
                  value={newClan.logo}
                  onChange={(e) => setNewClan({ ...newClan, logo: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <input
                  type="text"
                  placeholder="Координаты базы"
                  value={newClan.baseCoordinates}
                  onChange={(e) => setNewClan({ ...newClan, baseCoordinates: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <input
                  type="text"
                  placeholder="URL фото базы"
                  value={newClan.basePhoto}
                  onChange={(e) => setNewClan({ ...newClan, basePhoto: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <input
                  type="date"
                  value={newClan.foundedDate}
                  onChange={(e) => setNewClan({ ...newClan, foundedDate: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all min-h-[44px]"
                />
                <input
                  type="text"
                  placeholder="Описание"
                  value={newClan.description}
                  onChange={(e) => setNewClan({ ...newClan, description: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addClan}
                  className="bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
                >
                  Сохранить клан
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Add City Form */}
          {isAddingNew && activeTab === 'cities' && (
            <div className="bg-[#151922] border border-white/8 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl">
              <h3 className="text-lg font-semibold mb-6">Создать новый город</h3>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
                <input
                  type="text"
                  placeholder="Название города *"
                  value={newCity.name}
                  onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <input
                  type="text"
                  placeholder="Мэр города *"
                  value={newCity.mayor}
                  onChange={(e) => setNewCity({ ...newCity, mayor: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <MemberInput
                  members={newCity.residents || []}
                  onChange={(residents) => setNewCity({ ...newCity, residents })}
                  placeholder="Жители (нажмите Enter после каждого ника)"
                />
                <input
                  type="text"
                  placeholder="Координаты"
                  value={newCity.coordinates}
                  onChange={(e) => setNewCity({ ...newCity, coordinates: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <input
                  type="text"
                  placeholder="URL фото города"
                  value={newCity.photo}
                  onChange={(e) => setNewCity({ ...newCity, photo: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <input
                  type="date"
                  value={newCity.foundedDate}
                  onChange={(e) => setNewCity({ ...newCity, foundedDate: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all min-h-[44px]"
                />
                <input
                  type="text"
                  placeholder="Описание"
                  value={newCity.description}
                  onChange={(e) => setNewCity({ ...newCity, description: e.target.value })}
                  className="bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addCity}
                  className="bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
                >
                  Сохранить город
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Clans List */}
          {activeTab === 'clans' && (
            <div className="space-y-4 sm:space-y-6">
              {clans.map((clan) => (
                <ClanCard
                  key={clan.id}
                  clan={clan}
                  onDelete={deleteClan}
                  onUpdate={updateClan}
                  canEdit={canEdit()}
                />
              ))}

              {clans.length === 0 && (
                <div className="text-center py-12 sm:py-20 bg-[#151922] border border-white/8 rounded-xl">
                  <div className="text-[#6B7280] mb-2">Пока нет кланов</div>
                  <p className="text-sm text-[#6B7280] px-4">
                    {canEdit()
                      ? 'Нажмите "Добавить клан" чтобы создать первый клан'
                      : 'Кланы появятся здесь, когда их создадут администраторы'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cities List */}
          {activeTab === 'cities' && (
            <div className="space-y-4 sm:space-y-6">
              {cities.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  onDelete={deleteCity}
                  onUpdate={updateCity}
                  canEdit={canEdit()}
                />
              ))}

              {cities.length === 0 && (
                <div className="text-center py-12 sm:py-20 bg-[#151922] border border-white/8 rounded-xl">
                  <div className="text-[#6B7280] mb-2">Пока нет городов</div>
                  <p className="text-sm text-[#6B7280] px-4">
                    {canEdit()
                      ? 'Нажмите "Добавить город" чтобы создать первый город'
                      : 'Города появятся здесь, когда их создадут администраторы'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151922] border border-white/8 rounded-xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Вход</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#B4BFCD] mb-2">Имя пользователя</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all min-h-[44px]"
                  placeholder="Введите ваш ник"
                />
              </div>
              <div>
                <label className="block text-sm text-[#B4BFCD] mb-2">Пароль (только для админа)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all min-h-[44px]"
                  placeholder="Пароль"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleLogin}
                  className="flex-1 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
                >
                  Войти
                </button>
                <button
                  onClick={() => setShowLogin(false)}
                  className="bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151922] border border-white/8 rounded-xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Поделиться сайтом</h2>
            <p className="text-[#B4BFCD] mb-6 text-sm sm:text-base">
              Скопируйте эту ссылку и отправьте игрокам вашего сервера. Они смогут просматривать кланы и города.
            </p>
            <div className="bg-[#1E2430] border border-white/8 p-4 rounded-lg mb-6 break-all font-mono text-xs sm:text-sm text-[#00D9FF]">
              {window.location.href}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyShareLink}
                className="flex-1 bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
              >
                Скопировать ссылку
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && isAdmin() && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151922] border border-white/8 rounded-xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6">Управление правами доступа</h2>

            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-medium mb-4">Редакторы (могут создавать и редактировать)</h3>
              <div className="space-y-2 mb-4">
                {permissions.editors.length === 0 ? (
                  <p className="text-[#6B7280] text-sm">Нет редакторов. Добавьте ники игроков ниже.</p>
                ) : (
                  permissions.editors.map((editor, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#1E2430] border border-white/8 px-4 py-3 rounded-lg">
                      <span className="text-white break-all">{editor}</span>
                      <button
                        onClick={() => removeEditor(editor)}
                        className="text-[#EF4444] hover:text-[#EF4444]/80 transition-colors p-2 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newEditorUsername}
                  onChange={(e) => setNewEditorUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addEditor()}
                  placeholder="Введите ник игрока"
                  className="flex-1 bg-[#1E2430] border border-white/8 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF]/50 focus:ring-2 focus:ring-[#00D9FF]/20 transition-all placeholder:text-[#6B7280] min-h-[44px]"
                />
                <button
                  onClick={addEditor}
                  className="bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#0A0E14] px-6 py-3 rounded-lg font-medium transition-all min-h-[44px] whitespace-nowrap"
                >
                  Добавить
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/8">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="w-full bg-[#1E2430] hover:bg-[#1E2430]/70 border border-white/8 text-white px-6 py-3 rounded-lg font-medium transition-all min-h-[44px]"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
