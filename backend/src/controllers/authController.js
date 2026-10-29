// In-memory credential verification & authentication controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required"
      });
    }

    const cleanUser = username.trim().toLowerCase();

    // Default system authorized accounts
    const VALID_ACCOUNTS = {
      admin: {
        pass: "admin123",
        name: "System Administrator",
        role: "District Healthcare Admin",
        department: "Directorate of Public Health",
        badge: "Full Clearance"
      },
      officer: {
        pass: "health2026",
        name: "Dr. Kavin Kumar",
        role: "Chief Epidemiological Officer",
        department: "Epidemic Surveillance Division",
        badge: "Level 4 Clearance"
      },
      kavin: {
        pass: "kavin123",
        name: "Kavin Kumar",
        role: "Field Health Surveillance Lead",
        department: "Community Health Taskforce",
        badge: "Field Operations"
      },
      hcw: {
        pass: "hcw2026",
        name: "Community Health Worker",
        role: "Field Healthcare Responder",
        department: "Rural Health Outpost",
        badge: "Field Officer"
      }
    };

    const account = VALID_ACCOUNTS[cleanUser];

    // Check account password or accept any test user with password >= 4 chars for demo convenience
    if (account && account.pass === password) {
      return res.status(200).json({
        success: true,
        token: `sih-token-${cleanUser}-${Date.now()}`,
        user: {
          id: `usr-${cleanUser}`,
          username: cleanUser,
          name: account.name,
          role: account.role,
          department: account.department,
          badge: account.badge,
          loginTime: new Date().toISOString()
        }
      });
    } else if (!account && password.length >= 4) {
      // Dynamic fallback for any custom credentials entered
      return res.status(200).json({
        success: true,
        token: `sih-token-${cleanUser}-${Date.now()}`,
        user: {
          id: `usr-${cleanUser}`,
          username: cleanUser,
          name: username.charAt(0).toUpperCase() + username.slice(1),
          role: "Epidemiological Officer",
          department: "District Surveillance Unit",
          badge: "Active Session",
          loginTime: new Date().toISOString()
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: "Invalid username or password. Use demo credentials."
    });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ success: false, error: "Authentication service error" });
  }
};
