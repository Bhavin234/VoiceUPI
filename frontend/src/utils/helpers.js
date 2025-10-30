export const parseVoiceCommand = (transcript) => {
  const lower = transcript.toLowerCase().trim();
  
  console.log('🎤 Parsing voice command:', transcript);

  // Check balance
  if (lower.includes('balance') || lower.includes('बैलेंस') || lower.includes('खाता')) {
    console.log('✓ Detected: check_balance');
    return {
      action: 'check_balance',
      confidence: 0.95
    };
  }

  // Show transactions
  if (lower.includes('transaction') || lower.includes('history') || 
      lower.includes('लेनदेन') || lower.includes('इतिहास')) {
    console.log('✓ Detected: show_transactions');
    return {
      action: 'show_transactions',
      confidence: 0.9
    };
  }

  // Send money patterns - more flexible
  const patterns = [
    // Basic patterns with "to"
    /(?:send|pay|transfer|give)\s+(?:rupees?\s+)?(\d+)\s+(?:rupees?\s+)?to\s+(\w+)/i,
    /(?:send|pay|transfer|give)\s+(\d+)\s+to\s+(\w+)/i,
    
    // Amount first, then name
    /(\d+)\s+(?:rupees?\s+)?(?:to|for)\s+(\w+)/i,
    
    // Name first patterns
    /(?:to|pay)\s+(\w+)\s+(\d+)\s*(?:rupees?)?/i,
    
    // Very flexible - just look for number and name
    /(\d+).*?(\w+)/i,
    
    // Hindi patterns
    /(\d+)\s+(?:रुपये|रुपए)\s+(.+)\s+को\s+(?:भेजो|भेजें|दो)/i,
    /(.+)\s+को\s+(\d+)\s+(?:रुपये|रुपए)\s+(?:भेजो|भेजें|दो)/i
  ];

  for (let i = 0; i < patterns.length; i++) {
    const match = lower.match(patterns[i]);
    if (match) {
      console.log(`✓ Pattern ${i} matched:`, match);
      
      let amount, recipient;
      
      // Check if it's a Hindi pattern or name-first pattern
      if (i === patterns.length - 1) {
        // Last Hindi pattern: name first, amount second
        recipient = match[1].trim();
        amount = parseInt(match[2]);
      } else if (i === 3) {
        // Name first pattern: pay NAME AMOUNT
        recipient = match[1].trim();
        amount = parseInt(match[2]);
      } else {
        // Standard: amount first, name second
        amount = parseInt(match[1]);
        recipient = match[2].trim();
      }

      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        console.log('✗ Invalid amount:', amount);
        continue;
      }

      // Validate recipient
      if (!recipient || recipient.length < 2) {
        console.log('✗ Invalid recipient:', recipient);
        continue;
      }

      console.log('✓ Parsed successfully:', { amount, recipient });
      return {
        action: 'send_money',
        amount,
        recipient,
        confidence: 0.85
      };
    }
  }

  console.log('✗ No pattern matched');
  return {
    action: 'unknown',
    message: 'Could not understand the command',
    confidence: 0
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const validateAmount = (amount) => {
  if (!amount || amount <= 0) {
    return 'Amount must be greater than 0';
  }
  if (amount > 100000) {
    return 'Amount cannot exceed ₹1,00,000';
  }
  return null;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid 10-digit phone number';
  }
  return null;
};

export const getLanguageName = (code) => {
  const languages = {
    'en-IN': 'English',
    'hi-IN': 'हिंदी (Hindi)',
    'ta-IN': 'தமிழ் (Tamil)',
    'te-IN': 'తెలుగు (Telugu)'
  };
  return languages[code] || 'English';
};
