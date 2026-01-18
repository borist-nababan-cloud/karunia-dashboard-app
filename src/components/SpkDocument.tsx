import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

// Use standard fonts that are available in most systems
// Logo will be handled dynamically to avoid import issues

export interface SpkDocumentData {
  spkNumber: string;
  date: string;
  customer: {
    namaLengkap: string;
    alamat: string;
    kecamatan: string;
    kotaKabupaten: string;
    kodePos: string;
    noTelepon: string;
    noTeleponAlt: string;
    email: string;
    noKtp: string;
    npwp: string;
    pembayaran: string;
    jenisPerusahaan: string;
    namaPerusahaan: string;
    alamatPerusahaan: string;
    npwpPerusahaan: string;
  };
  vehicle: {
    tipeKendaraan: string;
    tahunPembuatan: string;
    warnaKendaraan: string;
    warnaInterior: string;
    noMesin: string;
    noRangka: string;
    hargaSatuan: string;
    aksesoris: Array<{
      nama: string;
      harga: string;
    }>;
    totalHarga: string;
    uangMuka: string;
    sisaPembayaran: string;
    alamatKirim: string;
    jangkaWaktuPengiriman: string;
    namaPenerima: string;
  };
  sales: {
    nama: string;
  };
  signatures: {
    customer: string;
    cabang: string;
  };
}

export interface SpkDocumentProps {
  data: SpkDocumentData;
}

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    fontFamily: 'Helvetica', // Use system font
    padding: 40,
    backgroundColor: '#ffffff',
    lineHeight: 1.5,
  },
  // Header section
  logoSection: {
    marginBottom: 10,
  },
  logo: {
    width: 300,
    height: 50,
    objectFit: 'contain',
  },
  // Title section
  titleSection: {
    textAlign: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: '#555',
  },
  // SPK Info
  spkInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  spkNo: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  spkDate: {
    fontSize: 11,
  },
  // Form sections
  formContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  formSection: {
    flex: 1,
    border: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  formTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textDecoration: 'underline',
  },
  fieldContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  fieldInput: {
    flex: 1,
    borderBottom: 1,
    borderBottomColor: '#ccc',
    fontSize: 10,
    minHeight: 16,
    paddingTop: 2,
  },
  // Table
  table: {
    width: '100%',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottom: 1,
    borderBottomColor: '#ccc',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 5,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRight: 1,
    borderRightColor: '#ccc',
  },
  tableHeaderCellLast: {
    borderRight: 'none',
  },
  tableHeaderCellPrice: {
    flex: 1.5,
    textAlign: 'right',
    borderRight: 1,
    borderRightColor: '#ccc',
    padding: 5,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableHeaderCellPriceLast: {
    borderRight: 'none',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#eee',
  },
  tableRowTotal: {
    borderTop: 2,
    borderTopColor: '#000',
    borderBottom: 'none',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    borderRight: 1,
    borderRightColor: '#ccc',
  },
  tableCellLast: {
    borderRight: 'none',
  },
  tableCellPrice: {
    flex: 1.5,
    textAlign: 'right',
    borderRight: 1,
    borderRightColor: '#ccc',
    padding: 5,
    fontSize: 10,
  },
  tableCellPriceLast: {
    borderRight: 'none',
  },
  // Payment details
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  paymentLabel: {
    width: 120,
    fontSize: 10,
    textAlign: 'right',
    paddingRight: 10,
  },
  paymentValue: {
    width: 100,
    fontSize: 10,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  // Notes
  notesSection: {
    fontSize: 9,
    marginBottom: 30,
  },
  notesTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesList: {
    paddingLeft: 20,
  },
  noteItem: {
    marginBottom: 2,
  },
  // Signatures
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  signatureBox: {
    width: 150,
    textAlign: 'center',
  },
  signatureLabel: {
    fontSize: 10,
    marginBottom: 30,
  },
  signatureLine: {
    borderTop: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    fontSize: 10,
  },
});

const SpkDocument: React.FC<SpkDocumentProps> = ({ data }) => {
  const formatCurrency = (amount: string) => {
    const num = parseInt(amount.replace(/\D/g, ''));
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Company Title */}
        <View style={styles.logoSection}>
          <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>KARUNIA MOTOR</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>SURAT PESANAN KENDARAAN</Text>
          <Text style={styles.subtitle}>No. : {data.spkNumber}</Text>
          <Text style={styles.subtitle}>{data.date}</Text>
        </View>

        {/* Forms Container */}
        <View style={styles.formContainer}>
          {/* Left Form - Customer Data */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>DATA PEMESAN</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nama</Text>
              <View style={styles.fieldInput}>
                <Text>{data.customer.namaLengkap || '_'}</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Alamat</Text>
              <View style={[styles.fieldInput, { height: 40 }]}>
                <Text>{data.customer.alamat || '_'}</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tlp / HP</Text>
              <View style={styles.fieldInput}>
                <Text>{data.customer.noTelepon || '_'}</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.fieldInput}>
                <Text>{data.customer.email || '_'}</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Pembayaran</Text>
              <View style={styles.fieldInput}>
                <Text>{data.customer.pembayaran || '_'}</Text>
              </View>
            </View>
          </View>

          {/* Right Form - Vehicle Data */}
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>DATA KENDARAAN</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tipe</Text>
              <View style={styles.fieldInput}>
                <Text>{data.vehicle.tipeKendaraan || '_'}</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tahun</Text>
              <View style={styles.fieldInput}>
                <Text>{data.vehicle.tahunPembuatan || '_'}</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Warna</Text>
              <View style={styles.fieldInput}>
                <Text>{data.vehicle.warnaKendaraan || '_'}</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>No. Rangka</Text>
              <View style={styles.fieldInput}>
                <Text>{data.vehicle.noRangka || 'Dilihat pada unit'}</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>No. Mesin</Text>
              <View style={styles.fieldInput}>
                <Text>{data.vehicle.noMesin || 'Dilihat pada unit'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableHeaderCell}>
              <Text>No.</Text>
            </View>
            <View style={styles.tableHeaderCell}>
              <Text>Keterangan Barang</Text>
            </View>
            <View style={[styles.tableHeaderCell, { flex: 2 }]}>
              <Text>Keterangan</Text>
            </View>
            <View style={styles.tableHeaderCellPrice}>
              <Text>Jumlah</Text>
            </View>
            <View style={styles.tableHeaderCellPriceLast}>
              <Text>Harga</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>1.</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Unit Baru</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text>{data.vehicle.tipeKendaraan}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>1 Unit</Text>
            </View>
            <View style={styles.tableCellPriceLast}>
              <Text>{formatCurrency(data.vehicle.hargaSatuan)}</Text>
            </View>
          </View>

          {/* Accessories if any */}
          {data.vehicle.aksesoris && data.vehicle.aksesoris.length > 0 && data.vehicle.aksesoris.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>{index + 2}.</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Accesories</Text>
              </View>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text>{item.nama}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>1 Unit</Text>
              </View>
              <View style={styles.tableCellPriceLast}>
                <Text>{formatCurrency(item.harga)}</Text>
              </View>
            </View>
          ))}

          {/* Total */}
          <View style={[styles.tableRow, styles.tableRowTotal]}>
            <View style={[styles.tableCell, styles.tableCellLast, { flex: 5.5 }]}>
              <Text style={{ textAlign: 'right', paddingRight: 10 }}>TOTAL HARGA</Text>
            </View>
            <View style={[styles.tableCellPriceLast, { fontWeight: 'bold' }]}>
              <Text>{formatCurrency(data.vehicle.totalHarga)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={{ marginBottom: 20 }}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Uang Muka (30%):</Text>
            <Text style={styles.paymentValue}>{formatCurrency(data.vehicle.uangMuka)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Sisa Pembayaran (70%):</Text>
            <Text style={styles.paymentValue}>{formatCurrency(data.vehicle.sisaPembayaran)}</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>KETERANGAN:</Text>
          <View style={styles.notesList}>
            <Text style={styles.noteItem}>- Harga sewaktu-waktu dapat berubah tanpa pemberitahuan terlebih dahulu.</Text>
            <Text style={styles.noteItem}>- Harga sudah termasuk BBN dan STNK.</Text>
            <Text style={styles.noteItem}>- Waktu pengiriman paling lama 3 bulan sejak SPK ditandatangani.</Text>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={{ marginBottom: 30 }}>
          <Text style={[styles.fieldLabel, { marginBottom: 10 }]}>Alamat Kirim:</Text>
          <View style={[styles.fieldInput, { height: 40 }]}>
            <Text>{data.vehicle.alamatKirim || data.customer.alamat || '_'}</Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Pemesan</Text>
            <View style={styles.signatureLine}>
              <Text>{data.customer.namaLengkap}</Text>
            </View>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Sales</Text>
            <View style={styles.signatureLine}>
              <Text>{data.sales.nama}</Text>
            </View>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Cabang</Text>
            <View style={styles.signatureLine}>
              <Text>{data.signatures.cabang}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SpkDocument;