exports.handler = async (event) => {
    let body = JSON.parse(event.body)
    const response = {
        statusCode: 200,
        body: `HelloWorlds ${body.name}`,
    };
    return response;
};