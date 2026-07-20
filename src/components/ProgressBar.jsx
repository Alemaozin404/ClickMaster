export default function ProgressBar({ totalEarned }) {
  let width = '0%';
  if (totalEarned > 0) {
    const magnitude = Math.pow(10, Math.floor(Math.log10(totalEarned)));
    const progress = (totalEarned % magnitude) / magnitude * 100;
    width = Math.min(progress, 100) + '%';
  }

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width }}></div>
    </div>
  );
}
