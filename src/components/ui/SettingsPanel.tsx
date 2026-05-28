import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Volume2, VolumeX, Zap, Eye, EyeOff, RotateCcw, Trash2, Sun, Moon } from 'lucide-react';

interface SettingsProps {
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
  onReset: () => void;
}

export default function SettingsPanel({ soundEnabled, onSoundToggle, onReset }: SettingsProps) {
  const [settings, setSettings] = useState(() => {
    const cached = localStorage.getItem('appSettings');
    return cached
      ? JSON.parse(cached)
      : {
          soundVolume: 70,
          visualEffects: true,
          animationsEnabled: true,
          notificationsEnabled: true,
          autoSave: true,
          dataCollection: false,
        };
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const cached = localStorage.getItem('theme');
    return (cached as 'dark' | 'light') || 'dark';
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const handleSoundVolumeChange = (volume: number) => {
    setSettings({ ...settings, soundVolume: volume });
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(`${newTheme}-mode`);
  };

  const handleClearAllData = () => {
    localStorage.clear();
    setShowDeleteConfirm(false);
    alert('✅ Semua data telah dihapus. Halaman akan di-refresh...');
    window.location.reload();
  };

  const handleFactoryReset = () => {
    localStorage.setItem('cachedXpCount', '0');
    localStorage.setItem('cachedCompletedGames', '[]');
    localStorage.setItem('cachedAchievements', JSON.stringify([]));
    localStorage.setItem('playerName', 'Player');
    setShowResetConfirm(false);
    alert('✅ Game progress telah di-reset. Halaman akan di-refresh...');
    window.location.reload();
  };

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Settings Header */}
      <div className="glass-card rounded-2xl p-6 border border-white/8 mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-3 mb-2">
          <SettingsIcon size={20} className="text-[#00D4FF]" />
          Pengaturan
        </h2>
        <p className="text-sm text-slate-400">Sesuaikan preferensi aplikasi Anda</p>
      </div>

      {/* Theme Selection */}
      <div className="glass-card rounded-2xl p-6 border border-white/8">
        <label className="text-sm font-semibold text-white mb-4 flex items-center gap-2 cursor-pointer">
          <Sun size={16} className="text-[#F59E0B]" />
          Tema
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'dark', label: '🌙 Dark Mode', icon: Moon },
            { id: 'light', label: '☀️ Light Mode', icon: Sun },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => handleThemeChange(option.id as 'dark' | 'light')}
              className={`py-3 px-4 rounded-lg transition-all font-semibold text-sm flex items-center justify-center gap-2 ${
                theme === option.id
                  ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 shadow-lg shadow-[#00D4FF]/10'
                  : 'bg-slate-800/50 text-slate-400 border border-white/8 hover:border-white/20'
              }`}
            >
              <option.icon size={18} />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audio Settings */}
      <div className="glass-card rounded-2xl p-6 border border-white/8">
        <label className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          {soundEnabled ? <Volume2 size={16} className="text-[#8B5CF6]" /> : <VolumeX size={16} />}
          Audio
        </label>

        <div className="space-y-4">
          {/* Master Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Volume Utama</span>
              <span className="text-sm font-bold text-[#00D4FF]">{settings.soundVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.soundVolume}
              onChange={(e) => handleSoundVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800/50 rounded-full appearance-none cursor-pointer accent-[#00D4FF]"
              disabled={!soundEnabled}
            />
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => onSoundToggle(!soundEnabled)}
            className={`w-full py-3 px-4 rounded-lg transition-all font-semibold text-sm flex items-center justify-between ${
              soundEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-white/8 hover:border-white/20'
            }`}
          >
            {soundEnabled ? '🔊 Sound Enabled' : '🔇 Sound Disabled'}
            <span className="text-[10px] font-mono opacity-75">
              {soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Visual Settings */}
      <div className="glass-card rounded-2xl p-6 border border-white/8">
        <label className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Eye size={16} className="text-[#10B981]" />
          Visual
        </label>

        <div className="space-y-3">
          {[
            {
              id: 'visualEffects',
              label: 'Efek Visual',
              desc: 'Glow, blur, dan efek neon',
              icon: '✨',
            },
            {
              id: 'animationsEnabled',
              label: 'Animasi',
              desc: 'Smooth transitions & motion',
              icon: '🎬',
            },
            { id: 'notificationsEnabled', label: 'Notifikasi', desc: 'Alert & popup messages', icon: '🔔' },
            {
              id: 'autoSave',
              label: 'Auto-Save',
              desc: 'Simpan progress secara otomatis',
              icon: '💾',
            },
          ].map((setting) => (
            <button
              key={setting.id}
              onClick={() => setSettings({ ...settings, [setting.id]: !settings[setting.id] })}
              className={`w-full p-4 rounded-lg transition-all border text-left ${
                settings[setting.id]
                  ? 'bg-slate-800/40 border-white/8 hover:border-white/15'
                  : 'bg-slate-900/40 border-white/4 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{setting.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{setting.label}</p>
                    <p className="text-[10px] text-slate-500">{setting.desc}</p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-colors ${
                    settings[setting.id]
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700/50 text-slate-500'
                  }`}
                >
                  {settings[setting.id] ? '✓' : '○'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
        <h3 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
          <Zap size={16} />
          Zona Berbahaya
        </h3>

        <div className="space-y-3">
          {/* Reset Game Progress */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full p-4 rounded-lg border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 transition-all text-left font-semibold text-sm flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <RotateCcw size={16} />
              Reset Progress
            </span>
            <span className="text-[10px] opacity-70 group-hover:opacity-100">→</span>
          </button>

          {/* Clear All Data */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-4 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-left font-semibold text-sm flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Trash2 size={16} />
              Hapus Semua Data
            </span>
            <span className="text-[10px] opacity-70 group-hover:opacity-100">→</span>
          </button>
        </div>

        {/* Confirmation Dialogs */}
        {showResetConfirm && (
          <div className="mt-4 p-4 rounded-lg bg-slate-900/80 border border-orange-500/50 space-y-3">
            <p className="text-sm text-orange-300">
              ⚠️ Ini akan mereset semua XP, badges, dan progress game. Aksi ini tidak bisa dibatalkan!
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleFactoryReset}
                className="flex-1 py-2 px-3 rounded-lg bg-orange-600/80 hover:bg-orange-600 text-white font-bold text-sm transition-all"
              >
                Ya, Reset Semua
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="mt-4 p-4 rounded-lg bg-slate-900/80 border border-red-500/50 space-y-3">
            <p className="text-sm text-red-300">
              ⚠️ Ini akan menghapus SEMUA data aplikasi termasuk profil, settings, dan history. Tidak bisa dikembalikan!
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClearAllData}
                className="flex-1 py-2 px-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold text-sm transition-all"
              >
                Ya, Hapus Semuanya
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* App Info */}
      <div className="glass-card rounded-2xl p-6 border border-white/8">
        <h3 className="text-sm font-bold text-white mb-3">Informasi Aplikasi</h3>
        <div className="space-y-2 text-[10px] text-slate-400">
          <div className="flex justify-between">
            <span>Versi:</span>
            <span className="text-slate-300 font-mono">2.6.0</span>
          </div>
          <div className="flex justify-between">
            <span>Build:</span>
            <span className="text-slate-300 font-mono">20260529</span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated:</span>
            <span className="text-slate-300 font-mono">29 May 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
