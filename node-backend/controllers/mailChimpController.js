const axios = require('axios');
const crypto = require('crypto');

const mailchimpBaseUrl = `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;

const subscribe = async (req, res) => {
    try {
      const user = req.user;
      const email = user?.email;
  
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }
  
      const response = await axios.post(
        `${mailchimpBaseUrl}/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`,
        {
          email_address: email,
          status: 'subscribed'
        },
        {
          auth: {
            username: 'anystring',
            password: process.env.MAILCHIMP_API_KEY
          }
        }
      );
  
      res.json({
        success: true,
        message: 'Subscribed successfully',
        data: response.data
      });
    } catch (error) {
      console.error('Subscription error:', error?.response?.data || error.message);
      res.status(500).json({
        success: false,
        message: error?.response?.data?.detail || 'Failed to subscribe'
      });
    }
  };
const unsubscribe = async (req, res) => {
    const user = req.user;
    const email=user.email
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

    try {
        const response = await axios.patch(`${mailchimpBaseUrl}/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members/${emailHash}`,
            {
                status: 'unsubscribed'
            },
            {
                auth: {
                    username: 'anystring',
                    password: process.env.MAILCHIMP_API_KEY
                }
            });

        res.status(200).json({ message: 'Unsubscribed successfully', data: response.data });
    } catch (error) {
        res.status(500).json({ error: error.response.data.detail });
    }
}

module.exports= { subscribe, unsubscribe }