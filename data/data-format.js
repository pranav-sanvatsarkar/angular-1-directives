fields = [
    {
        label: String,
        apiName: String,
        type: { type: String, enum: [String, Boolean, Date, Number] },
        format: {
            currencyISOCode: String,
            currencySymbol: String,
            digitSeperator: String,
            dateFormat: String,
            timeFormat: String,
            dateTimeFormat: String,
            maskType: String,
            maskCharacters: String
        }
    }
]