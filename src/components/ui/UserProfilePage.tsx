import { useState } from 'react';
import { User, Edit2, Save, X, Flame, TrendingUp, Award, Zap, Calendar } from 'lucide-react';

interface UserProfile {
  name: string;
  bio: string;
  joinDate: string;
  favoriteGame: string;
  avatar: string;
}

interface UserProfileProps {
  playerName: string;
  level: number;
  xp: number;
  achievements: number;
  gamesCompleted: number;
  streak: number;
}

export default function UserProfilePage(props: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('userProfile');
    return cached
      ? JSON.parse(cached)
      : {
          name: props.playerName || 'Player',
          bio: 'AI Arena enthusiast 🤖',
          joinDate: new Date().toISOString(),
          favoriteGame: 'neuron-builder',
          avatar: '🤖',
        };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem('userProfile', JSON.stringify(editForm));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const joinDays = Math.floor(
    (new Date().getTime() - new Date(profile.joinDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const avatarOptions = ['🤖', '🧠', '⚡', '🎯', '🏆', '🚀', '🎮', '💡'];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/8">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl bg-gradient-to-br from-[#00D4FF]/20 to-[#8B5CF6]/20 border-2 border-[#00D4FF]/30 shadow-lg shadow-[#00D4FF]/20">
                {profile.avatar}
              </div>
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-white/10 rounded-lg p-2 flex gap-1">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setEditForm({ ...editForm, avatar: emoji })}
                      className="w-8 h-8 rounded hover:bg-slate-800/60 transition-colors text-xl flex items-center justify-center"
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full text-2xl sm:text-3xl font-black font-display text-white bg-slate-800/50 rounded-lg px-3 py-2 border border-white/10 mb-2"
                    placeholder="Player Name"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-white mb-2">
                    {profile.name}
                  </h1>
                )}

                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full text-sm text-slate-300 bg-slate-800/50 rounded-lg px-3 py-2 border border-white/10"
                    placeholder="Tell us about yourself..."
                    maxLength={100}
                  />
                ) : (
                  <p className="text-sm text-slate-400 italic">{profile.bio}</p>
                )}
              </div>

              <button
                onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                  isEditing
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-[#00D4FF]/20 text-[#00D4FF] hover:bg-[#00D4FF]/30 border border-[#00D4FF]/30'
                }`}
                title={isEditing ? 'Cancel' : 'Edit'}
              >
                {isEditing ? <X size={18} /> : <Edit2 size={18} />}
              </button>
            </div>

            {/* Level & Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { icon: TrendingUp, label: 'Level', value: props.level, color: '[#00D4FF]' },
                { icon: Zap, label: 'Total XP', value: props.xp, color: '[#F59E0B]' },
                { icon: Award, label: 'Badges', value: props.achievements, color: '[#10B981]' },
                { icon: Flame, label: 'Streak', value: props.streak, color: '[#EF4444]' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="p-2 rounded-lg bg-slate-800/40 border border-white/6">
                    <Icon size={14} className={`text-${stat.color} mb-1`} />
                    <p className="text-[9px] text-slate-500 uppercase tracking-wide">{stat.label}</p>
                    <p className={`text-sm font-bold text-${stat.color}`}>{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Join Info */}
        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-500" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Member for</p>
              <p className="text-sm font-semibold text-white">{joinDays} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award size={14} className="text-slate-500" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Games Played</p>
              <p className="text-sm font-semibold text-white">{props.gamesCompleted}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User size={14} className="text-slate-500" />
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Joined</p>
              <p className="text-sm font-semibold text-white">
                {new Date(profile.joinDate).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-slate-950 font-bold uppercase tracking-wider text-sm transition-all hover:shadow-lg hover:shadow-[#00D4FF]/30 flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Simpan Profil
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-2 px-4 rounded-lg border border-white/10 bg-slate-800/50 text-slate-300 font-bold uppercase tracking-wider text-sm transition-all hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <X size={16} />
              Batal
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="glass-card rounded-2xl p-6 border border-white/8">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={16} />
          Ringkasan Pencapaian
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'XP per Level',
              value: `${Math.round(props.xp / Math.max(1, props.level))}`,
              detail: 'rata-rata XP/level',
            },
            {
              title: 'Achievement Rate',
              value: `${Math.round((props.achievements / 12) * 100)}%`,
              detail: '${props.achievements} dari 12 badges',
            },
            {
              title: 'Game Completion',
              value: `${Math.round((props.gamesCompleted / 7) * 100)}%`,
              detail: '${props.gamesCompleted} dari 7 games',
            },
            {
              title: 'Current Streak',
              value: props.streak > 0 ? '🔥 ' + props.streak : '🚀 Start!',
              detail: 'Pertahankan konsistensimu!',
            },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-lg bg-slate-800/40 border border-white/6">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">{stat.title}</p>
              <p className="text-2xl font-bold text-[#00D4FF] mb-1">{stat.value}</p>
              <p className="text-[9px] text-slate-400">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
