
export default function Avatar({ name = '', avatarUrl = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-12 h-12 text-base',
  };

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  const getBgColor = (text) => {
    if (!text) return 'bg-[#EDE9FE] text-[#7C3AED]';
    const charCode = text.charCodeAt(0) || 0;
    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-emerald-100 text-emerald-700',
      'bg-orange-100 text-orange-700',
      'bg-blue-100 text-blue-700',
      'bg-pink-100 text-pink-700',
      'bg-purple-100 text-purple-700',
    ];
    return colors[charCode % colors.length];
  };

  const colorClass = getBgColor(initials);

  return (
    <div
      className={`rounded-full flex items-center justify-center font-black select-none border border-white overflow-hidden shadow-sm flex-shrink-0 ${sizeClasses[size] || sizeClasses.md} ${colorClass}`}
    >
      {avatarUrl && !avatarUrl.startsWith('/avatars/') ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
