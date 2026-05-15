import ButtonControl from './ButtonControl';
import { DEFAULT_LABELS } from './crud/constants';

const EMPTY = {};

function BulkEditToolbar({
    bulkEditMode,
    selectedCount = 0,
    canDelete = true,
    labels: customLabels,
    onEnterBulkMode,
    onExitBulkMode,
    onBulkDelete,
    children,
    rightContent,
}) {
    const labels = { ...DEFAULT_LABELS, ...customLabels };

    return (
        <div className="crud-toolbar">
            <div className="crud-toolbar-left">
                {!bulkEditMode && (
                    <ButtonControl control={{ value: labels.bulkEditButton, className: 'btn-outline', onClick: onEnterBulkMode }} rowData={EMPTY} rowIndex={0} />
                )}
                {bulkEditMode && (
                    <>
                        <ButtonControl control={{ value: labels.bulkEditCancelButton, className: 'btn-warning', onClick: onExitBulkMode }} rowData={EMPTY} rowIndex={0} />
                        {canDelete && (
                            <ButtonControl control={{ value: labels.bulkDeleteButton, className: 'btn-danger', disabled: selectedCount === 0, onClick: onBulkDelete }} rowData={EMPTY} rowIndex={0} />
                        )}
                        <span className={`crud-selected-count${selectedCount === 0 ? ' crud-selected-count-zero' : ''}`}>{selectedCount} {labels.selectedCount}</span>
                    </>
                )}
                {children}
            </div>
            {rightContent && (
                <div className="crud-toolbar-right">
                    {rightContent}
                </div>
            )}
        </div>
    );
}

export default BulkEditToolbar;
