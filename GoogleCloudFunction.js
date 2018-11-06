/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.main = (req, res) => {
    console.log(req.body);

    res.header('Content-Type', 'text/plain');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    //respond to CORS preflight requests
    if (req.method == 'OPTIONS') {
        res.status(204).send('');
    }

    res.status(200).send('OK');
};
