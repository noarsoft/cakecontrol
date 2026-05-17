import Icon from './Icon';

export default function EmptyState({ icon, title, subtitle, ctaLabel, onAction }) {
    return (
        <div className="ui-empty-state">
            {icon && (
                <Icon
                    name={icon}
                    size="3xl"
                    style={{ color: 'var(--text-tertiary)', opacity: 0.5, strokeWidth: 1 }}
                />
            )}
            {title && <p className="ui-empty-title">{title}</p>}
            {subtitle && <p className="ui-empty-sub">{subtitle}</p>}
            {ctaLabel && onAction && (
                <button className="ui-empty-cta" onClick={onAction}>
                    <Icon name="plus" size="md" />
                    {ctaLabel}
                </button>
            )}
        </div>
    );
}
