# Group Project Task Manager

A collaborative task management and update tracking web application perfect for GitHub Pages deployment.

## 🌟 GitHub Pages Ready

This application is designed to work perfectly with GitHub Pages:
- **No Server Required**: Runs entirely in the browser
- **Static Files**: Only HTML, CSS, and JavaScript
- **Local Storage**: Data persists in browser storage
- **Multi-tab Sync**: Changes sync across browser tabs

## Features

### 🎯 Task Management
- **Add Tasks**: Create new tasks and assign them to team members
- **Task Status**: Mark tasks as completed or pending
- **Task Filtering**: View all tasks, pending tasks, or completed tasks
- **Task Assignment**: Assign tasks to specific team members (Tristan, Aidan, Micheala, Leandro)
- **Task Deletion**: Remove tasks that are no longer needed
- **Wipe All Tasks**: Clear all tasks with confirmation warning

### 📝 Update Log
- **Track Progress**: Log daily updates and work completed
- **Author Attribution**: Each update is attributed to the team member who made it
- **Timestamp**: Automatic timestamp for each update
- **Chronological Order**: Updates displayed in reverse chronological order

### 👥 Team Members
- **Visual Team Display**: Shows all team members with colored avatars
- **Personalized Assignments**: Tasks and updates can be assigned to specific team members

### 📊 Statistics Dashboard
- **Total Tasks**: Overview of all tasks in the project
- **Completed Tasks**: Track progress with completed task count
- **Pending Tasks**: See remaining work to be done
- **Update Count**: Total number of project updates logged

### 💾 Data Features
- **Local Storage**: Data saved in browser localStorage
- **Auto-save**: Changes automatically saved
- **Multi-tab Sync**: Changes sync across open tabs
- **Persistent**: Data survives browser restarts

## Team Members

- **Tristan** - Blue avatar
- **Aidan** - Green avatar  
- **Micheala** - Purple avatar
- **Leandro** - Orange avatar

## GitHub Pages Deployment

### 🚀 Quick Setup

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add task manager"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (or master)
   - Folder: / (root)
   - Click Save

3. **Access Your Site**
   - Your site will be available at: `https://[username].github.io/[repository-name]`

### 📁 File Structure
```
Group project thing/
├── index.html          # Main HTML structure
├── script.js           # JavaScript functionality
└── README.md           # This documentation file
```

## How to Use

1. **Open the Website**: Visit your GitHub Pages URL
2. **Add Tasks**: 
   - Enter a task description
   - Assign it to a team member (optional)
   - Click "Add" or press Enter
3. **Manage Tasks**:
   - Click the checkbox to mark tasks as complete
   - Click the trash icon to delete tasks
   - Use filter buttons to view specific task types
   - Use "Wipe All Tasks" to clear everything (with confirmation)
4. **Log Updates**:
   - Enter what you worked on
   - Select your name from the dropdown
   - Click "Add" to log your update
5. **View Statistics**: Check the dashboard at the bottom for project overview

## 🔄 Multi-tab Sync

The application automatically syncs data across multiple browser tabs:
- **Real-time Updates**: Changes appear in all open tabs
- **Conflict Resolution**: Latest changes take precedence
- **Auto-refresh**: Checks for updates every 3 seconds

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **TailwindCSS**: Modern, responsive styling (via CDN)
- **Vanilla JavaScript**: Interactive functionality
- **Font Awesome**: Icon library (via CDN)
- **LocalStorage**: Browser-based data persistence

### Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Data Management

### Storage Location
- Data is stored in browser's localStorage
- Each domain/subdomain has separate storage
- Data persists until manually cleared

### Data Sharing
- **Same Browser**: Tabs sync automatically
- **Different Browsers**: Data is separate (browser-specific)
- **Different Devices**: Each device has independent data

### Backup & Export
- Data can be exported via browser developer tools
- Consider screenshots for important milestones
- Manual backup of localStorage contents possible

## Tips for Team Use

### 📋 Task Management Best Practices
1. **Be Specific**: Clear, actionable task descriptions
2. **Assign Ownership**: Always assign tasks to team members
3. **Regular Updates**: Log progress daily
4. **Review Statistics**: Check progress regularly

### 👥 Collaboration Tips
1. **Same Browser**: Use same browser for best sync experience
2. **Regular Check-ins**: Review tasks together periodically
3. **Clear Communication**: Use update log for status updates
4. **Task Completion**: Mark tasks done promptly

### 🔄 Data Management
1. **Regular Cleanup**: Delete completed tasks periodically
2. **Milestone Tracking**: Use update log for major achievements
3. **Backup Important Data**: Consider manual backups for critical info

## Troubleshooting

### Common Issues

**Data not syncing between tabs?**
- Wait up to 3 seconds for auto-sync
- Check that both tabs are on the same URL
- Refresh the page if needed

**Lost data after browser update?**
- Data should persist in localStorage
- Check browser settings for data clearing
- Some browser updates may clear storage

**Tasks not saving?**
- Check browser console for errors
- Ensure localStorage is enabled
- Try refreshing the page

### Performance Tips
- **Large Task Lists**: Consider archiving completed tasks
- **Regular Cleanup**: Delete unnecessary tasks/updates
- **Browser Restart**: Occasionally restart browser for optimal performance

## Customization

### 🎨 Styling
- Modify TailwindCSS classes in index.html
- Add custom CSS in the `<style>` section
- Update color scheme for team avatars

### 👥 Team Members
- Edit team member names in script.js
- Update avatar colors and initials
- Add or remove team members as needed

### 🔧 Functionality
- JavaScript functions can be modified in script.js
- Add new features like task priorities
- Implement custom filtering options

## Security & Privacy

### 🔒 Data Privacy
- Data stored locally in browser only
- No data sent to external servers
- Private to each browser/device

### 🛡️ Best Practices
- Don't store sensitive information in tasks
- Regular backup of important data
- Use HTTPS when deploying (GitHub Pages provides this)

## Getting Started Checklist

1. ✅ Fork or create repository
2. ✅ Add files to repository
3. ✅ Push to GitHub
4. ✅ Enable GitHub Pages
5. ✅ Share URL with team members
6. ✅ Start collaborating!

## Support

For issues or questions:
- Check this README first
- Test in different browsers if needed
- Ensure JavaScript is enabled
- Verify GitHub Pages is correctly configured

---

**Perfect for student projects, team collaborations, and task tracking!** 🚀
