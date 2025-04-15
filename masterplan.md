Web-based application for Expected Credit Loss (ECL) automation based on PSAK 71 and PSAK 413 for Syariah Banks.

📁 Modules Overview
Master Data (Nasabah, Akad, Transaksi)

PD Engine (Probability of Default)

LGD Engine (Loss Given Default)

Fair Value Adjustment

Forward-Looking Adjustment

ECL Engine

Provisi Kafalah

Reporting & Dashboard

Integration Core Banking & General Ledger

User & Role Management

🧱 Modules, Features, & Fields
1. Master Data
Features:

CRUD Nasabah

CRUD Transaksi Syariah

Master Akad

Import data CSV

Tables & Fields:

nasabah

nasabah_id (PK)

nama

alamat

jenis_nasabah

no_identitas

segmentasi

created_at, updated_at

akad_syariah

akad_id (PK)

nama_akad

jenis_akad (Murabahah, Ijarah, dll)

deskripsi

transaksi_syariah

transaction_id (PK)

nasabah_id (FK)

akad_id (FK)

tanggal_akad

pokok_pembiayaan

margin

tenor_bulan

status_transaksi (aktif, lunas, macet)

kolektibilitas_terkini

tanggal_update_kolektibilitas

2. PD Engine
Features:

PD Generator from Migration Matrix

Simulasi PD

Riwayat Kolektibilitas

Tables & Fields:

pd_migration_matrix

matrix_id (PK)

periode_awal

periode_akhir

dari_kolektibilitas

ke_kolektibilitas

probability_value

pd_result

pd_id (PK)

transaction_id (FK)

kolektibilitas_awal

kolektibilitas_akhir

pd_percentage

tanggal_perhitungan

3. LGD Engine
Features:

Input agunan & nilai wajar

Simulasi expected recovery

Simpan nilai LGD

Tables & Fields:

lgd_input

lgd_id (PK)

transaction_id (FK)

jenis_agunan

nilai_agunan_awal

nilai_pasaran

haircut_persen

expected_recovery

lgd_percentage

tanggal_perhitungan

4. Fair Value Adjustment
Features:

Hitung amortized cost

Hitung nilai fair value

Override manual FV

Tables & Fields:

fair_value_adjustment

fair_value_id (PK)

transaction_id (FK)

amortized_cost

nilai_fair_value

tenor_sisa

rate_diskonto

tanggal_valuasi

5. Forward-Looking Adjustment (FLA)
Features:

Input skenario ekonomi

Simulasi FLA Factor

Adjust PD/LGD

Tables & Fields:

fla_skenario

fla_id (PK)

transaction_id (FK)

nama_skenario

inflasi

pertumbuhan_ekonomi

suku_bunga

sektor_usaha

fla_factor

tanggal_perhitungan

6. ECL Engine
Features:

Hitung CKPN = PD × LGD × FV × FLA

Simulasi per Skenario

Approval workflow

Tables & Fields:

ecl_result

ecl_id (PK)

transaction_id (FK)

pd_value

lgd_value

fair_value

forward_looking_factor

calculated_ecl

tanggal_perhitungan

status (draft, approved, posted)

approved_by

7. Provisi Kafalah
Features:

Hitung provisi kafalah

Monitoring nilai penjaminan

Simpan riwayat

Tables & Fields:

kafalah

kafalah_id (PK)

nasabah_id (FK)

transaction_id (FK)

nilai_kafalah

jenis_kafalah

tanggal_terbit

tanggal_berakhir

provisi_kafalah

provisi_id (PK)

kafalah_id (FK)

pd

lgd

nilai_provisi

tanggal_perhitungan

status (draft, posted)

8. Reporting & Dashboard
Features:

Laporan CKPN

Laporan Kafalah

Export PDF & Excel

Dashboard visual (chart & table)

Tables & Fields:

report_log

report_id (PK)

tipe_report

parameter

format (PDF/Excel)

created_by

created_at

9. Integration to Core Banking & GL
Features:

Pull transaksi, agunan, kolektibilitas

Push jurnal ke GL

Log integrasi

Tables & Fields:

integration_log

integration_id (PK)

module_name (e.g. transaksi, agunan, ecl_posting)

status (success, failed)

payload_summary

response_message

created_at

gl_journal

journal_id (PK)

ecl_id (FK)

gl_account

debit_amount

credit_amount

posting_date

posted_by

10. User & Role Management
Features:

Login, JWT auth

Role & permission

Audit log user

Tables & Fields:

user

user_id (PK)

username

password_hash

full_name

email

role_id (FK)

is_active

last_login

role

role_id (PK)

nama_role

deskripsi

user_activity_log

log_id (PK)

user_id (FK)

modul

aksi

timestamp

keterangan

🗓️ Timeline Suggestion (Simplified)

Month	Modules Focus
1	Module 1, 10
2	Module 2 & 3 (PD, LGD)
3	Module 4 & 5 (Fair Value, FLA)
4	Module 6 (ECL Engine)
5	Module 7 (Kafalah) + Integration to GL
6	Module 8 (Reporting)
7	Module 9 (Integration Core) + Test
8	UAT, Training
9	Go-Live & Monitoring