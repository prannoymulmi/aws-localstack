import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let body= JSON.parse(event.body? event.body: '')
    return {
        statusCode: 200,
        body: JSON.stringify({
            message:  `HelloWorlds ${body.name}`,
        }),
    };
};
