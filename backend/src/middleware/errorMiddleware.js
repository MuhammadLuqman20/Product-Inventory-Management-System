const errorMiddleware = (err, req, res, next) => {

    console.error(err);


    // Duplicate key error (MongoDB)
    if (err.code === 11000) {

        const field = Object.keys(err.keyValue)[0];

        return res.status(409).json({

            error: {
                code: "DUPLICATE_VALUE",
                message: `${field} already exists`
            }

        });

    }


    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {

        return res.status(400).json({

            error: {
                code: "INVALID_ID",
                message: "Invalid resource ID"
            }

        });

    }


    // Default server error

    return res.status(err.statusCode || 500).json({

        error: {

            code: err.code || "SERVER_ERROR",

            message: err.message || "Something went wrong"

        }

    });

};


export default errorMiddleware;