import { WebsiteData } from './types';

export const INITIAL_DATA: WebsiteData = {
  title: "SK Masjid Tanah",
  font: "sans",
  primaryColor: "#1e40af",
  secondaryColor: "#fbbf24",
  pages: [
    {
      id: 'home',
      name: 'Utama',
      slug: 'utama',
      sections: [
        {
          id: 'ticker-1',
          type: 'ticker',
          data: { label: "INFO TERKINI", text: "Pendaftaran murid tahun 1 sesi 2025 kini dibuka. Sila hubungi pejabat untuk maklumat lanjut.", direction: 'left', speed: 20 }
        },
        {
          id: 'hero-1',
          type: 'hero',
          data: {
            title: "SK MASJID TANAH",
            subtitle: "PENDIDIKAN BERKUALITI INSAN TERDIDIK NEGARA SEJAHTERA",
            bgImage: "https://images.unsplash.com/photo-1577896334698-70c858c14172?q=80&w=2071&auto=format&fit=crop",
            buttonText: "Hubungi Kami",
            fontSize: 'md',
            overlayOpacity: 0.8
          }
        },
        {
          id: 'news-feed',
          type: 'news',
          data: {
            title: "BERITA & PENGUMUMAN",
            items: [
              { id: '1', title: "Gotong Royong Perdana 2024", date: "2024-03-25", tag: "HEM", content: "Program gotong royong akan diadakan pada hari Sabtu melibatkan semua guru dan PIBG." },
              { id: '2', title: "Kejohanan Sukan Tahunan", date: "2024-04-10", tag: "KOK", content: "Latihan rumah sukan bermula minggu hadapan. Sila bawa pakaian sukan lengkap." },
              { id: '3', title: "Ujian Pentaksiran 1", date: "2024-05-02", tag: "KUR", content: "Jadual waktu ujian telah diedarkan kepada semua murid tahun 4, 5 dan 6." }
            ]
          }
        },
        {
          id: 'divider-1',
          type: 'divider',
          data: { style: 'solid', color: '#e5e7eb', thickness: 2 }
        },
        {
          id: 'history',
          type: 'content',
          data: {
            title: "SEJARAH KAMI",
            body: "Sekolah Kebangsaan Masjid Tanah (SKMT) telah ditubuhkan pada tahun 1950-an dan merupakan salah satu institusi pendidikan tertua di daerah Alor Gajah. \n\nBermula dengan sebuah bangunan kayu yang sederhana yang menempatkan 50 orang murid, sekolah ini kini telah berkembang pesat dengan prasarana moden termasuk makmal komputer, pusat sumber, dan dewan terbuka. Sepanjang sejarahnya, SKMT telah melahirkan ramai tokoh pemimpin dan profesional yang menyumbang kepada pembangunan negara.",
            alignment: "center",
            fontSize: 'md'
          }
        },
        {
          id: 'spacer-1',
          type: 'spacer',
          data: { height: 50 }
        },
        {
          id: 'logo-school',
          type: 'definition',
          data: {
            title: "MAKSUD LOGO SEKOLAH",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Coat_of_arms_of_Malaysia.svg/1200px-Coat_of_arms_of_Malaysia.svg.png", // Placeholder
            items: [
              { term: "Obor", definition: "Melambangkan semangat perjuangan ilmu yang tidak pernah padam." },
              { term: "Buku", definition: "Sumber ilmu pengetahuan yang menjadi teras pendidikan." },
              { term: "Warna Biru", definition: "Perpaduan dan keharmonian warga sekolah." },
              { term: "Warna Kuning", definition: "Kesetiaan kepada Raja dan Negara." }
            ]
          }
        },
        {
          id: 'flag-school',
          type: 'definition',
          data: {
            title: "BENDERA SEKOLAH",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Flag_of_Malaysia.svg/2560px-Flag_of_Malaysia.svg.png", // Placeholder
            items: [
              { term: "Jalur Merah", definition: "Keberanian menghadapi cabaran." },
              { term: "Jalur Putih", definition: "Kesucian hati dan niat dalam menuntut ilmu." },
              { term: "Lambang Sekolah", definition: "Identiti dan kebanggaan setiap warga SKMT." }
            ]
          }
        },
        {
          id: 'links-1',
          type: 'feature',
          data: {
            title: "PAUTAN PANTAS",
            features: [
              { title: "APDM", description: "Aplikasi Pangkalan Data Murid", icon: "Monitor", link: "https://apdm.moe.gov.my/" },
              { title: "SAPS IBU BAPA", description: "Sistem Analisis Peperiksaan Sekolah", icon: "Book", link: "https://sapsnkra.moe.gov.my/ibubapa2/" },
              { title: "DELIMA", description: "Digital Educational Learning Initiative Malaysia", icon: "Zap", link: "https://sites.google.com/moe.edu.my/login/login" }
            ],
            fontSize: 'md'
          }
        },
        {
          id: 'speech-img',
          type: 'image',
          data: {
            url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
            caption: "GURU BESAR CEMERLANG SK MASJID TANAH",
            width: "small",
            animation: "zoom"
          }
        },
        {
          id: 'speech-text',
          type: 'content',
          data: {
            title: "PERUTUSAN GURU BESAR",
            body: "Assalamualaikum Warahmatullahi Wabarakatuh dan Salam Sejahtera.\n\nSelamat datang ke laman web rasmi SK Masjid Tanah. Laman web ini dibangunkan sebagai wadah informasi dan komunikasi antara pihak sekolah, ibu bapa, dan komuniti. Kami komited untuk melahirkan modal insan yang seimbang dari segi jasmani, emosi, rohani, dan intelek selaras dengan Falsafah Pendidikan Kebangsaan.\n\nSemoga laman ini dapat memberikan manfaat kepada semua.",
            alignment: "center",
            fontSize: 'md'
          }
        },
        {
          id: 'contact-main',
          type: 'contact',
          data: {
            title: "Hubungi Kami",
            email: "mba0001@moe.edu.my",
            phone: "+606-3841234",
            address: "SK Masjid Tanah (Integrasi), 78300 Masjid Tanah, Melaka.",
            mapUrl: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.3664723469145!2d102.1091233147551!3d2.383569998262791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d1e56b9710cf4b%3A0x66b6b12b7d6309d2!2sSK%20Masjid%20Tanah!5e0!3m2!1sen!2smy!4v1647831234567" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
          }
        },
        {
          id: 'footer-main',
          type: 'footer',
          data: {
            copyright: "© 2024 SK MASJID TANAH. HAK CIPTA TERPELIHARA."
          }
        }
      ]
    }
  ]
};

export const AVAILABLE_IMAGES = [
  "https://picsum.photos/1920/1080",
  "https://picsum.photos/800/600",
  "https://picsum.photos/800/601",
  "https://picsum.photos/800/602",
];