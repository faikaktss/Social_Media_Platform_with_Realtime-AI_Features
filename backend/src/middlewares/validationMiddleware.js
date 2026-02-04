const validate = (schema) => {
    return (req, res, next) => {
        //Todo: Kullanıcının gönderdiği veriyi kurallara uygun mu onu kontrol et
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,  // Todo:Tüm hataları toplayıp hepsini bir arada söyler
            stripUnknown: true  //Todo:Tanımsız olan alanları temizler
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path[0],  
                message: detail.message    
            }));

            return res.status(400).json({
                success: false,
                errors: errors
            });
        }

        req.body = value;
        next();  
    };
};

module.exports = validate;