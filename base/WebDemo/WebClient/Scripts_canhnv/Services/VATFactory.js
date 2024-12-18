app.factory("VATFactory", function () {
    return {
        calculator_BeforeVAT: function (before_VAT, tax_rate) {
            return before_VAT - before_VAT * (tax_rate / 100);
        }
    };
});
