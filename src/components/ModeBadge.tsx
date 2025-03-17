interface ModeBadgeProps {
    mode: 'survey' | 'qa';
}

const ModeBadge = ({ mode }: ModeBadgeProps) => {
    return (
        <span
            className={`
          inline-block px-2 py-0.5 mb-2 text-xs font-medium rounded-full
          ${mode === 'survey'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                }
        `}
        >
            {mode === 'survey' ? 'Survei' : 'Tanya Jawab'}
        </span>
    );
};

export default ModeBadge;