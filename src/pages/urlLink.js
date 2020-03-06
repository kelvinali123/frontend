/* URL to get Data withPagination
KO ERVIN: http://10.0.112.164:8081/getUnitList
    WILB :http://10.0.112.246:8081/getUnitList  */

    //MASTER UNIT
    var url_getListByPaging="https://api.docnet.id/getUnitList";
    //URL TAMBAH UNIT
    var url_insertMasterUnit="https://api.docnet.id/newUnit";    
    //URL AKTIF/NONAKTIF UNIT
    var url_setUnitActiveYN ="https://api.docnet.id/updateStatusUnit";

    //MASTER KEMASAN
    var url_tampil_kemasan = "https://api.docnet.id/MasterKemasan/TampilSemuaKemasan";
    // export default url_tampil_kemasan    
    var url_cari_kodekemasan = "https://api.docnet.id/MasterKemasan/CariKodeKemasan";
    // export default url_cari_kodekemasan
    var url_cari_namakemasan = "https://api.docnet.id/MasterKemasan/CariNamaKemasan";
    // export default url_cari_namakemasan
    var url_tambah_kemasan = "https://api.docnet.id/MasterKemasan/TambahKemasan";
    // export default url_tambah_kemasan
    var url_edit_kemasan = "https://api.docnet.id/MasterKemasan/EditKemasan";
    // export default url_edit_kemasan
    var url_hapus_kemasan = "https://api.docnet.id/MasterKemasan/HapusKemasan";
    // export default url_hapus_kemasan 
    var url_tampil_kemasan_limit = 'https://api.docnet.id/MasterKemasan'
    
    //MASTER STRENGTH
    var url_CetakStrength_Count = "https://api.docnet.id/MasterStrength/CetakStrengthCount"
    var url_PencarianStrengthKode_Count = "https://api.docnet.id/MasterStrength/PencarianStrengthKodeCount"
    var url_PencarianStrengthNama_Count = "https://api.docnet.id/MasterStrength/PencarianStrengthNamaCount"
    var url_CetakStrength_Halaman = "https://api.docnet.id/MasterStrength/CetakStrengthHalaman"
    var url_PencarianStrengthKode_Halaman = "https://api.docnet.id/MasterStrength/PencarianStrengthKodeHalaman"
    var url_PencarianStrengthNama_Halaman = "https://api.docnet.id/MasterStrength/PencarianStrengthNamaHalaman"
    var url_TambahStrength = "https://api.docnet.id/MasterStrength/TambahStrength"
    var url_HapusStrength = "https://api.docnet.id/MasterStrength/HapusStrength"
    
    export {url_getListByPaging, url_insertMasterUnit, url_setUnitActiveYN,
            url_tampil_kemasan, url_tampil_kemasan_limit, url_cari_kodekemasan, url_cari_namakemasan,
            url_tambah_kemasan, url_edit_kemasan, url_hapus_kemasan,
            url_CetakStrength_Count, url_PencarianStrengthKode_Count, 
            url_PencarianStrengthNama_Count, url_CetakStrength_Halaman,
            url_PencarianStrengthKode_Halaman, url_PencarianStrengthNama_Halaman,
            url_TambahStrength, url_HapusStrength};