import Icon from './Icon';

/**
 * Shared icon-only square button (no visible label). Backed by .ui-icon-btn
 * in styles/ui.css. `label` is required — it sets both the accessible name
 * and the tooltip, since there is no visible text.
 *
 * @param {string} icon                       Icon name (see Icon.jsx)
 * @param {'default'|'danger'|'success'} variant  Hover tone
 * @param {'sm'|'md'} size                     28px (sm) or 34px (md)
 * @param {string} label                       aria-label + title
 */
export default function IconButton({
    icon,
    variant = 'default',
    size = 'md',
    label,
    iconSize,
    type = 'button',
    className = '',
    ...rest
}) {
    const classes = [
        'ui-icon-btn',
        variant !== 'default' && variant, // .danger / .success
        size === 'sm' && 'ui-icon-btn-sm',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            aria-label={label}
            title={label}
            {...rest}
        >
            <Icon name={icon} size={iconSize || (size === 'sm' ? 'sm' : 'lg')} />
        </button>
    );
}
