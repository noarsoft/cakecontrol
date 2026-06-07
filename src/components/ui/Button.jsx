import Icon from './Icon';

/**
 * Shared text / icon+text button. Single source of truth for button styling
 * across the app — see .ui-btn in styles/ui.css.
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'|'success'} variant
 * @param {'sm'|'md'} size
 * @param {string} [icon]       Icon name rendered before the label
 * @param {string} [iconRight]  Icon name rendered after the label
 * @param {boolean} [loading]   Shows a spinner and disables the button
 */
export default function Button({
    variant = 'secondary',
    size = 'md',
    icon,
    iconRight,
    loading = false,
    disabled = false,
    type = 'button',
    className = '',
    children,
    ...rest
}) {
    const iconSize = size === 'sm' ? 'sm' : 'md';
    const classes = [
        'ui-btn',
        `ui-btn-${variant}`,
        size === 'sm' && 'ui-btn-sm',
        loading && 'is-loading',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...rest}
        >
            {loading && <span className="ui-btn-spinner" aria-hidden="true" />}
            {!loading && icon && <Icon name={icon} size={iconSize} />}
            {children != null && children !== '' && (
                <span className="ui-btn-label">{children}</span>
            )}
            {!loading && iconRight && <Icon name={iconRight} size={iconSize} />}
        </button>
    );
}
