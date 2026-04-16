/**
 * seed.js — สร้าง demo data (พนักงาน + สินค้า)
 * Run: node src/db/seed.js
 */
import { schemaRepo, viewRepo, formcfgRepo, formRepo } from './database.js';

function seed() {
    // Skip if data exists
    if (schemaRepo.getAll().length > 0) {
        console.log('Data already exists — skipping seed');
        return;
    }

    // Schema: พนักงาน
    const s1 = schemaRepo.create('พนักงาน', {
        name: { type: 'string', label: 'ชื่อ-นามสกุล' },
        age: { type: 'number', label: 'อายุ' },
        role: { type: 'select', label: 'สิทธิ์', enum: ['Admin', 'User', 'Guest'] },
        email: { type: 'email', label: 'อีเมล' },
        is_active: { type: 'boolean', label: 'สถานะ' },
    });

    viewRepo.create(s1.id, 'table', {
        columns: [
            { key: 'name', header: 'ชื่อ', width: 'auto', sortable: true },
            { key: 'age', header: 'อายุ', width: '80', sortable: true },
            { key: 'role', header: 'สิทธิ์', width: '100', sortable: true },
            { key: 'email', header: 'อีเมล', width: 'auto', sortable: true },
            { key: 'is_active', header: 'สถานะ', width: '80', type: 'badge' },
        ],
    }, 'ตารางพนักงาน');

    formcfgRepo.create(s1.id, {
        colnumbers: 6,
        controls: [
            { key: 'name', label: 'ชื่อ-นามสกุล', colno: 1, rowno: 1, colspan: 6, placeholder: 'กรอกชื่อ' },
            { key: 'email', label: 'อีเมล', colno: 1, rowno: 2, colspan: 6, placeholder: 'กรอกอีเมล' },
            { key: 'age', label: 'อายุ', colno: 1, rowno: 3, colspan: 3 },
            { key: 'role', label: 'สิทธิ์', colno: 4, rowno: 3, colspan: 3 },
            { key: 'is_active', label: 'สถานะใช้งาน', colno: 1, rowno: 4, colspan: 3 },
        ],
    }, 'ฟอร์มพนักงาน');

    formRepo.create(s1.id, { name: 'สมชาย ใจดี', age: 28, role: 'Admin', email: 'somchai@example.com', is_active: true });
    formRepo.create(s1.id, { name: 'สมหญิง รักงาน', age: 25, role: 'User', email: 'somying@example.com', is_active: true });
    formRepo.create(s1.id, { name: 'สมศักดิ์ มานะ', age: 32, role: 'User', email: 'somsak@example.com', is_active: false });

    // Schema: สินค้า
    const s2 = schemaRepo.create('สินค้า', {
        product_name: { type: 'string', label: 'ชื่อสินค้า' },
        price: { type: 'number', label: 'ราคา' },
        category: { type: 'select', label: 'หมวดหมู่', enum: ['อาหาร', 'เครื่องดื่ม', 'ของใช้', 'อื่นๆ'] },
        in_stock: { type: 'boolean', label: 'มีสต็อก' },
    });

    viewRepo.create(s2.id, 'table', {
        columns: [
            { key: 'product_name', header: 'ชื่อสินค้า', width: 'auto', sortable: true },
            { key: 'price', header: 'ราคา', width: '100', sortable: true },
            { key: 'category', header: 'หมวดหมู่', width: '120', sortable: true },
            { key: 'in_stock', header: 'มีสต็อก', width: '80', type: 'badge' },
        ],
    }, 'ตารางสินค้า');

    formcfgRepo.create(s2.id, {
        colnumbers: 6,
        controls: [
            { key: 'product_name', label: 'ชื่อสินค้า', colno: 1, rowno: 1, colspan: 6, placeholder: 'กรอกชื่อสินค้า' },
            { key: 'price', label: 'ราคา (บาท)', colno: 1, rowno: 2, colspan: 3 },
            { key: 'category', label: 'หมวดหมู่', colno: 4, rowno: 2, colspan: 3 },
            { key: 'in_stock', label: 'มีสต็อก', colno: 1, rowno: 3, colspan: 3 },
        ],
    }, 'ฟอร์มสินค้า');

    formRepo.create(s2.id, { product_name: 'ข้าวผัด', price: 50, category: 'อาหาร', in_stock: true });
    formRepo.create(s2.id, { product_name: 'น้ำส้ม', price: 25, category: 'เครื่องดื่ม', in_stock: true });

    console.log('Seed complete: 2 schemas, 2 views, 2 formcfgs, 5 records');
}

seed();
