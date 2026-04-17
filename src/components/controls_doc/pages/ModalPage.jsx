import React, { useState } from 'react';
import { ModalControl, ButtonControl } from '../../controls';

function ModalPage({ addLog }) {
    const [showBasic, setShowBasic] = useState(false);
    const [showSm, setShowSm] = useState(false);
    const [showLg, setShowLg] = useState(false);
    const [showNoTitle, setShowNoTitle] = useState(false);
    const [showFooter, setShowFooter] = useState(false);

    return (
        <div className="page-content">
            <h1>Modal Control</h1>
            <p className="lead">
                Generic modal component รองรับ custom content (children) สำหรับ form, content, หรืออะไรก็ได้
            </p>

            <section className="content-section">
                <h2>Overview</h2>
                <p>
                    ModalControl เป็น modal ที่รองรับ children แทนที่จะรับแค่ message text เหมือน AlertModal/ConfirmModal
                    ทำให้ใส่ form, table หรือ content อะไรก็ได้ข้างใน
                </p>
            </section>

            <section className="content-section">
                <h2>Live Demo</h2>
                <div className="example-demo" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <ButtonControl control={{
                        value: 'Basic Modal (md)',
                        className: 'btn-primary',
                        onClick: () => { setShowBasic(true); addLog?.('Opened basic modal'); },
                    }} rowData={{}} rowIndex={0} />

                    <ButtonControl control={{
                        value: 'Small Modal',
                        className: 'btn-secondary',
                        onClick: () => { setShowSm(true); addLog?.('Opened small modal'); },
                    }} rowData={{}} rowIndex={0} />

                    <ButtonControl control={{
                        value: 'Large Modal',
                        className: 'btn-secondary',
                        onClick: () => { setShowLg(true); addLog?.('Opened large modal'); },
                    }} rowData={{}} rowIndex={0} />

                    <ButtonControl control={{
                        value: 'No Title',
                        className: 'btn-secondary',
                        onClick: () => { setShowNoTitle(true); addLog?.('Opened no-title modal'); },
                    }} rowData={{}} rowIndex={0} />

                    <ButtonControl control={{
                        value: 'With Footer',
                        className: 'btn-primary',
                        onClick: () => { setShowFooter(true); addLog?.('Opened footer modal'); },
                    }} rowData={{}} rowIndex={0} />
                </div>

                {/* Basic */}
                <ModalControl
                    isOpen={showBasic}
                    title="Basic Modal"
                    onClose={() => setShowBasic(false)}
                >
                    <p>นี่คือ modal พื้นฐาน ใส่ content อะไรก็ได้ข้างใน</p>
                    <p>รองรับ Escape key และคลิก backdrop เพื่อปิด</p>
                </ModalControl>

                {/* Small */}
                <ModalControl
                    isOpen={showSm}
                    title="Small Modal"
                    size="sm"
                    onClose={() => setShowSm(false)}
                >
                    <p>Modal ขนาดเล็ก (max-width: 400px)</p>
                </ModalControl>

                {/* Large */}
                <ModalControl
                    isOpen={showLg}
                    title="Large Modal"
                    size="lg"
                    onClose={() => setShowLg(false)}
                >
                    <p>Modal ขนาดใหญ่ (max-width: 800px) เหมาะกับ content เยอะๆ หรือ table</p>
                </ModalControl>

                {/* No Title */}
                <ModalControl
                    isOpen={showNoTitle}
                    onClose={() => setShowNoTitle(false)}
                >
                    <p>Modal ไม่มี title bar — ใช้สำหรับ content อย่างเดียว</p>
                    <ButtonControl control={{
                        value: 'ปิด',
                        className: 'btn-secondary',
                        onClick: () => setShowNoTitle(false),
                    }} rowData={{}} rowIndex={0} />
                </ModalControl>

                {/* With Footer */}
                <ModalControl
                    isOpen={showFooter}
                    title="Modal with Footer"
                    onClose={() => setShowFooter(false)}
                    footer={
                        <>
                            <ButtonControl control={{
                                value: 'ยกเลิก',
                                className: 'btn-secondary',
                                onClick: () => setShowFooter(false),
                            }} rowData={{}} rowIndex={0} />
                            <ButtonControl control={{
                                value: 'บันทึก',
                                className: 'btn-primary',
                                onClick: () => { addLog?.('Footer: Save clicked'); setShowFooter(false); },
                            }} rowData={{}} rowIndex={0} />
                        </>
                    }
                >
                    <p>Modal ที่มี footer สำหรับปุ่ม action</p>
                    <p>ใช้ prop <code>footer</code> ส่ง JSX เข้าไป</p>
                </ModalControl>
            </section>

            <section className="content-section">
                <h2>Props Reference</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className="props-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-secondary)', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Prop</th>
                                <th style={{ padding: '10px' }}>Type</th>
                                <th style={{ padding: '10px' }}>Default</th>
                                <th style={{ padding: '10px' }}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['isOpen', 'boolean', 'false', 'แสดง/ซ่อน modal'],
                                ['title', 'string|null', 'undefined', 'Title bar (ถ้าไม่ส่งจะไม่แสดง header)'],
                                ['onClose', 'Function', '-', 'เรียกเมื่อปิด modal'],
                                ['size', "'sm'|'md'|'lg'|'xl'", "'md'", 'ขนาด modal'],
                                ['children', 'ReactNode', '-', 'เนื้อหาข้างใน modal'],
                                ['footer', 'ReactNode', '-', 'Footer area สำหรับปุ่ม'],
                                ['closeOnBackdropClick', 'boolean', 'true', 'ปิดเมื่อคลิก backdrop'],
                                ['closeOnEscapeKey', 'boolean', 'true', 'ปิดเมื่อกด Escape'],
                                ['className', 'string', "''", 'CSS class เพิ่มเติม'],
                            ].map(([prop, type, def, desc]) => (
                                <tr key={prop} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                    <td style={{ padding: '10px' }}><code>{prop}</code></td>
                                    <td style={{ padding: '10px' }}>{type}</td>
                                    <td style={{ padding: '10px' }}><code>{def}</code></td>
                                    <td style={{ padding: '10px' }}>{desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default ModalPage;
