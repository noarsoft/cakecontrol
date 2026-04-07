# TODO: CRUDControl — ALL DONE

## Phase 1: keyField Support — DONE
- [x] เพิ่ม `keyField` ใน config
- [x] `selectedRows` ใช้ key value แทน index
- [x] handleRowSelect, handleSelectAll, handleBulkDeleteConfirm ใช้ key values
- [x] checkbox checked state ใช้ key values
- [x] backward compatible (ไม่ส่ง keyField → ใช้ index เหมือนเดิม)

## Phase 2: callback ส่ง key กลับ — DONE
- [x] `onDelete(rowData, rowKey, rowIndex)`
- [x] `onEdit(formData, oldData, rowKey, rowIndex)`
- [x] `onBulkDelete(selectedItems, selectedKeys)`

## Phase 3: Auto CRUD Mode — DONE
- [x] ถ้ามี keyField + ไม่ส่ง callbacks → CRUDControl จัดการ data ภายในเอง
- [x] internal state sync จาก prop data
- [x] `onChange(newData)` callback ให้ parent sync ได้
- [x] auto add: สร้าง key อัตโนมัติ (`__auto_N`)
- [x] auto edit: update by keyField
- [x] auto delete + bulk delete: filter by keyField
- [x] toolbar buttons แสดงใน auto mode

## ModalControl — DONE
- [x] สร้าง `ModalControl.jsx` + `ModalControl.css`
- [x] CRUDControl ใช้ ModalControl แทน HTML เดิม
- [x] demo page + register ControlsDocs
