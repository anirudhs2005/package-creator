class CustomError extends Error{
			constructor(code,message,filePath, type='',index='Not Applicable'){
					super(message);
					this.code = code;
					this.filePath = filePath;
					this.type=type;
					this.index = index;
			}
}

module.exports.CustomError = CustomError;