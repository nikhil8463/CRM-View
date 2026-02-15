# Lead Import Template Documentation

## File Format
- Supported formats: CSV (.csv), Excel (.xls, .xlsx)
- Maximum file size: 10 MB
- First row must contain column headers (case-sensitive)

## Required Columns

| Column Name | Description | Example |
|------------|-------------|---------|
| `first_name` | Lead's first name | John |
| `last_name` | Lead's last name | Doe |
| `email` | Valid email address | john.doe@example.com |
| `phone` | Phone number with country code | +1-555-0101 |

## Optional Columns

| Column Name | Description | Example | Valid Values |
|------------|-------------|---------|--------------|
| `company` | Company name | Tech Solutions Inc | Any text |
| `title` | Job title | CTO | Any text |
| `source` | Lead source | website | website, referral, social_media, email_campaign, trade_show, cold_call, other |
| `country` | Country name | United States | Any text |
| `timezone` | IANA timezone | America/New_York | Valid timezone identifier |
| `status` | Lead status | new | new, contacted, qualified, proposal, negotiation, won, lost, nurturing, no_answer |
| `priority` | Lead priority | high | low, medium, high, urgent |
| `estimated_value` | Potential deal value | 50000 | Numeric value (no currency symbols) |
| `notes` | Additional notes | Interested in enterprise plan | Any text |

## Source Values
- `website` - Lead from website form
- `referral` - Referred by existing customer
- `social_media` - Social media channels
- `email_campaign` - Email marketing campaign
- `trade_show` - Trade shows and events
- `cold_call` - Cold calling
- `other` - Other sources

## Status Values
- `new` - New lead (default)
- `contacted` - Initial contact made
- `qualified` - Lead qualified
- `proposal` - Proposal sent
- `negotiation` - In negotiation
- `won` - Deal won
- `lost` - Deal lost
- `nurturing` - Long-term nurturing
- `no_answer` - No response

## Priority Values
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority
- `urgent` - Urgent attention needed

## Timezone Examples
Common timezone identifiers:
- `America/New_York` - Eastern Time (US)
- `America/Los_Angeles` - Pacific Time (US)
- `America/Chicago` - Central Time (US)
- `America/Toronto` - Eastern Time (Canada)
- `Europe/London` - UK
- `Europe/Paris` - Central European Time
- `Asia/Tokyo` - Japan
- `Australia/Sydney` - Australia

## Sample Data

```csv
first_name,last_name,email,phone,company,title,source,country,timezone,status,priority,estimated_value,notes
John,Doe,john.doe@example.com,+1-555-0101,Tech Solutions Inc,CTO,website,United States,America/New_York,new,high,50000,Interested in enterprise plan
Jane,Smith,jane.smith@company.com,+1-555-0102,Global Corp,Marketing Director,referral,Canada,America/Toronto,contacted,medium,35000,Follow up next week
```

## Import Process

1. **Prepare your data** according to the format requirements above
2. **Save the file** as CSV or Excel format
3. **Open the Lead Import modal** in the CRM system
4. **Click "Bulk Import"** tab
5. **Upload your file** and click "Upload Leads"
6. **Review the results** - the system will show:
   - Number of leads imported successfully
   - Number of duplicates detected
   - Any errors encountered

## Duplicate Detection

The system automatically detects duplicate leads based on email address. If a duplicate is found:
- The lead will still be imported
- It will be marked with `is_duplicate: true`
- A reference to the original lead will be stored

## Error Handling

If any row fails validation:
- The error will be reported with the row number
- Other valid rows will continue to be imported
- Review the error messages and correct the data

## Tips for Success

✅ **Do:**
- Use the provided template as a starting point
- Verify email addresses are valid
- Include country codes in phone numbers
- Use lowercase for source, status, and priority values
- Test with a small sample file first

❌ **Don't:**
- Leave required fields empty
- Use invalid enum values for source/status/priority
- Include currency symbols in estimated_value
- Exceed 10 MB file size
- Use special characters in column headers

## Support

For questions or issues with lead import:
- Check that your file matches the required format
- Download and review the sample template
- Contact your system administrator
