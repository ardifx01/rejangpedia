const AboutPage = () => {
  return (
    <div>
      <div className="container mx-auto mt-5 p-5">
        <h1 className="text-4xl font-bold mb-4">Tentang Rejangpedia</h1>
        <p className="text-lg">
          Rejangpedia adalah aplikasi yang dibuat dan dikembangkan oleh M. Fathin Halim, siswa kelas VIII SMPN 1 Rejang Lebong.
          Konsep dari Rejangpedia adalah aplikasi all-in dengan semangat gotong royong dalam melestarikan budaya Bengkulu pada
          umumnya dan Rejang Lebong pada khususnya dalam bentuk digital literasi, di mana setiap orang bisa ikut berpartisipasi.
        </p>
        <p className="text-lg mt-2">
          Kedepannya, Insyaallah Rejangpedia akan terus dikembangkan dengan menambah fitur media sosial dan kamus-kamus bahasa daerah
          lain yang ada di wilayah Bengkulu. Setiap orang dapat ikut berpartisipasi dengan menambahkan informasi dalam bentuk artikel
          dan kata-arti database kamus melalui proses moderasi terlebih dahulu.
        </p>

        <h2 className="text-3xl font-semibold mt-6">Fitur</h2>
        <ul className="list-disc list-inside text-lg mt-2">
          <li>Lihat artikel-artikel informatif tentang Rejang dan Bengkulu.</li>
          <li>Tambahkan artikel baru dan bagikan pengetahuan Anda.</li>
          <li>Edit artikel yang sudah ada untuk memperbarui informasi.</li>
          <li>Kamus Kata Bahasa Rejang.</li>
          <li>Konverter Ka Ga Nga.</li>
          <li>Media Sosial.</li>
        </ul>

        <h2 className="text-3xl font-semibold mt-6">Cara Berkontribusi</h2>
        <p className="text-lg mt-2">Jika Anda ingin berkontribusi pada pengembangan Rejangpedia, berikut adalah langkah-langkah umum:</p>
        <ol className="list-decimal list-inside text-lg mt-2">
          <li>Fork repositori ini.</li>
          <li>Buat branch baru: <code>git checkout -b fitur-baru</code>.</li>
          <li>Lakukan perubahan yang diperlukan dan commit: <code>git commit -m 'Menambahkan fitur baru'</code>.</li>
          <li>Push ke branch: <code>git push origin fitur-baru</code>.</li>
          <li>Buat pull request.</li>
        </ol>

        <h2 className="text-3xl font-semibold mt-6">Pengembangan Lokal</h2>
        <p className="text-lg mt-2">Untuk menjalankan Rejangpedia secara lokal, ikuti langkah-langkah berikut:</p>
        <ol className="list-decimal list-inside text-lg mt-2">
          <li>Install dependensi: <code>npm install</code>.</li>
          <li>Jalankan server: <code>npm start</code>.</li>
          <li>Buka <code>http://localhost:3000</code> di browser Anda.</li>
        </ol>

        <p className="text-lg mt-6 font-semibold">Dibuat oleh M. Fathin Halim</p>
      </div>
    </div>
  );
};

export default AboutPage;