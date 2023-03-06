var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

var usuarioSchema = new Schema({
    creadoDesdeIonic: { type: Boolean },
    noCorreo: { type: Boolean },
    error: { type: Boolean },
    nuevo: { type: Boolean },
    nombreOK: { type: Boolean },
    siigoOK: { type: Boolean },
    razonSocial: { type: String },
    nombreComercial: { type: String },
    primerNombre: { type: String },
    segundoNombre: { type: String },
    apellidos: { type: String },
    tipoId: { type: String, required: [true, 'El tipo de Id es necesario'] },
    numeroId: { type: String, required: [true, 'El número de Id es necesario'], unique: true },
    ciudad: { type: String, required: [true, 'La ciudad es necesaria'] },
    departamento: { type: String, required: [true, 'El departamento es necesario'] },
    direccion: { type: String, required: [true, 'La dirección es necesaria'] },
    telefono: { type: String, required: [true, 'El teléfono es necesario'] },
    email: { type: String },
    tipo: {
        type: String,
        enum: [
            'administrador',
            'tecnico',
            'cliente',
            'vendedor',
            'proveedor',
            'cajero'
        ]
    },
    password: {
        type: String,
        validate: [(password) => {
            return password && password.length > 6;
        }, 'Password should be longer']
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        // required: 'Provider is required'
    },
    responsabilidad: String,
    regimen: String,

    responsabilidadCode: String,
    regimenCode: String,
    responsabilidadName: String,
    regimenName: String,

    tipoPersonaCode: String,
    tipoDocumentoCode: String,
    tipoPersonaName: String,
    tipoDocumentoName: String,
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    },
    Id: Number,
    IdTypeCode: String,
    Identification: String,
    CheckDigit: String,
    IsSocialReason: Boolean,
    FullName: String,
    FirstName: String,
    LastName: String,
    Address: String,
    Phone: {
        Indicative: Number,
        Number: Number,
        Extention: Number
    },
    EMail: String,
    PrincipalContactID: Number,
    NombreVerificado: Boolean,

    IsLeaflet: Schema.Types.Mixed,
    IsCustomer: Schema.Types.Mixed,
    IsSupplier: Schema.Types.Mixed,
    IsDealer: Schema.Types.Mixed,
    IsBank: Schema.Types.Mixed,
    BranchOffice: Schema.Types.Mixed,
    IsVATCompanyType: Schema.Types.Mixed,
    WebSite: Schema.Types.Mixed,
    City: Schema.Types.Mixed,
    Fax: Schema.Types.Mixed,
    PostalCode: Schema.Types.Mixed,
    IsActive: Schema.Types.Mixed,
    DirectorID: Schema.Types.Mixed,
    SalesmanID: Schema.Types.Mixed,
    CollectorID: Schema.Types.Mixed,
    FiscalResponsibilities: Schema.Types.Mixed,
});



usuarioSchema.pre('save', function(next) {
    if (this.password) {
        // this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        // DeprecationWarning: Buffer() is deprecated due to security and usability issues.
        // Please use the
        // Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.
        this.salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

usuarioSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
};

usuarioSchema.methods.authenticate = function(password) {

    if (!this.salt) {
        return false;
    }
    return this.password === this.hashPassword(password);
};


usuarioSchema.set('toJSON', {
    getters: true,
    virtuals: true
});


/* usuarioSchema.pre('save', function (next) {
    console.log('SE HIZO HASH 1')
    if (this.password) {
        console.log('SE HIZO HASH 2')
        this.password = this.hashPassword(this.password);
    }
    console.log('SE HIZO HASH 3')
    next();
});

usuarioSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

usuarioSchema.methods.authenticate = function (password) {
    return bcrypt.compareSync(password, this.password);
};
 */

module.exports = mongoose.model('Usuario', usuarioSchema);
