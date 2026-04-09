## คำถามค้างไว้ (รอตอบ)

1. ~~data_form เก็บ form config~~ → ตอบแล้ว (ดูด้านล่าง)
2. ~~CRUD mode view~~ → ตอบแล้ว (แสดงตารางอย่างเดียว ไม่มีปุ่ม add/edit/delete)

## ค้างไว้: Round Robin data_form

- data_form เก็บข้อมูลเยอะขึ้นเรื่อยๆ
- ถ้า root_id (schema) เดียวกัน → เก็บใน table เดียวกันก่อน
- พอเยอะแล้ว → split ออก
- แนวทาง: PostgreSQL Table Partitioning (partition by fk_data_schema หรือ date)
- รอตัดสินใจ: กี่ records ถึง split? auto หรือ manual?
