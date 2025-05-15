import logger from '../../components/Logger/logger';

export async function POST(request) {
  try {
    const body = await request.json();
    const { level, message } = body;

    if (!level || !message) {
      return new Response(
        JSON.stringify({ message: 'Missing "level" or "message" in request body.' }),
        { status: 400 }
      );
    }

    // Log the message at the given level.
    logger.log(level, message);
    return new Response(JSON.stringify({ status: 'logged' }), { status: 200 });
  } catch (error) {
    // Log the error as well
    logger.error('Error in /api/logger route: ' + error.toString());
    return new Response(
      JSON.stringify({ message: 'Error logging message', error: error.toString() }),
      { status: 500 }
    );
  }
}