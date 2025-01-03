document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const goalForm = document.getElementById('goalForm');
    const goalInput = document.getElementById('goalInput');
    const goalList = document.getElementById('goalList');
    const commitButton = document.getElementById('commitButton');
    let githubToken = null;

    loginButton.addEventListener('click', () => {
        const authWindow = window.open('https://daily-goals-tracker-server-hzzepq7hw-dipaks-projects-4dd0a14a.vercel.app/login', 'GitHub Auth', 'width=600,height=400');
        window.addEventListener('message', (event) => {
            githubToken = event.data.token;
            if (githubToken) {
                loginButton.style.display = 'none';
                goalForm.style.display = 'block';
                goalList.style.display = 'block';
                commitButton.style.display = 'block';
                loadGoals();
            }
        });
    });

    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const goal = goalInput.value.trim();
        if (goal) {
            addGoal(goal);
            goalInput.value = '';
        }
    });

    commitButton.addEventListener('click', commitToGitHub);

    function addGoal(goal) {
        const li = document.createElement('li');
        li.textContent = goal;
        goalList.appendChild(li);
        saveGoals();
    }

    function saveGoals() {
        const goals = Array.from(goalList.children).map(li => li.textContent);
        localStorage.setItem('goals', JSON.stringify(goals));
    }

    function loadGoals() {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        goals.forEach(addGoal);
    }

    function commitToGitHub() {
        const goals = JSON.parse(localStorage.getItem('goals'));
        if (goals) {
            fetch('https://api.github.com/repos/Deadpool608/daily-goals-tracker/contents/goals.json', {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Daily goal update',
                    content: btoa(JSON.stringify(goals)),
                    sha: 'YOUR_FILE_SHA' // You might need to get the current SHA of the file if it already exists
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }

    loadGoals();
});
