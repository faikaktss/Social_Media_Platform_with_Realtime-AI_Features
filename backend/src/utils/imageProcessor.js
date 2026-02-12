const sharp = require('sharp'); //Todo: Görselleri yeniden boyutlandırmak  amaç
const path = require('path');
const fs = require('fs').promises;
const AppError = require('./AppError');
const { param } = require('../routes/likeRoutes');
const { string } = require('joi');



const processImage = async(filePath, maxwidth = 1920,maxHeight=1920,quality=80) => {
      const parsedPath = path.parse(filePath); //Todo: Dosya yolunu parçalara ayırır

      const outputFileName = `${parsedPath.name}-optimized.jpg`;
      const outputPath = path.join(parsedPath.dir, outputFileName);

      await sharp(filePath) //Todo: Sharp kütüphanesi ile görseli işliyorum
      .resize(maxHeight,maxwidth,{
        fit:'inside',
        withoutEnlargement:true
      })
      .jpeg({quality})
      .toFile(outputPath)
      .catch(async(error) =>{
        console.error('Sharp işleme hatası:', error.message);
        console.error('Dosya yolu:', filePath);
        await fs.unlink(filePath).catch(() =>{});
        throw new AppError('Görsel işlenirken hata oluştu',500);
      });

      //Todo: Orijinal dosyayı sil (optimize edilmiş versiyonu kullanacağım)
      await fs.unlink(filePath).catch(() =>{});

      return outputFileName;
};

module.exports = {processImage};