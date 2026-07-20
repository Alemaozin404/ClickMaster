export default function AchievementItem({ def, unlocked }) {
  return (
    <div className={`achievement-item ${unlocked ? 'unlocked' : 'locked'}`}>
      <div className="ach-icon">
        {def.icon}
        {!unlocked && <span className="lock-icon">🔒</span>}
      </div>
      <div className="ach-info">
        <div className="ach-name">{def.name}</div>
        <div className="ach-desc">{def.desc}</div>
      </div>
      <div className="ach-badge">{unlocked ? '✅' : '🔲'}</div>
    </div>
  );
}
