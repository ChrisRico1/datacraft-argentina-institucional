// Datos editables de Datacraft Argentina. Los contactos vacíos se ocultan en la interfaz.
export const site = {
  name: "Datacraft Argentina",
  social: {
    instagram: "https://www.instagram.com/datacraftargentina/",
    facebook: "https://www.facebook.com/DatacraftArgentina",
    youtube: "https://www.youtube.com/@DatacraftArgentina",
  },
  contact: {
    phone: "",
    whatsapp: "", // formato internacional sin "+", ej: 5491100000000
    email: "",
    address: "",
  },
};

/** CTA principal: WhatsApp si está confirmado, si no Instagram. */
export const primaryCtaHref = site.contact.whatsapp
  ? `https://wa.me/${site.contact.whatsapp}`
  : site.social.instagram;
