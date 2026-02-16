import { Code, BookOpen, FileText } from 'lucide-react';

export const EXAMS = [
    {
        id: 1,
        title: 'Algorithms & Data Structures',
        type: 'Mixed',
        icon: 'Code',
        duration: '45 mins',
        questions: [
            {
                id: 1,
                type: 'code',
                title: 'Shortest Path Algorithm',
                description: 'Given a directed graph, design an algorithm to find the shortest path between two nodes using only edges with even weights. Analyze the time and space complexity of your algorithm.'
            },
            {
                id: 2,
                type: 'code',
                title: 'Contiguous Subarray Max Sum',
                description: 'You are given an array of n integers. Design an algorithm to find the maximum sum of a contiguous subarray, but with the additional constraint that you can only include at most k negative numbers in the subarray.'
            },
            {
                id: 3,
                type: 'text',
                title: 'B-trees vs B+ trees',
                description: 'Explain the difference between B-trees and B+ trees. Describe a scenario where a B+ tree would be significantly more efficient than a B-tree, and justify your answer with respect to disk I/O operations.'
            }
        ],
        difficulty: 'Hard',
        color: 'from-blue-500 to-indigo-600',
        description: 'Implement complex algorithms and optimize data structures for maximum efficiency.'
    },
    {
        id: 2,
        title: 'Computer Networks Quiz',
        type: 'MCQ',
        icon: 'BookOpen',
        duration: '30 mins',
        questions: [
            {
                id: 1,
                type: 'mcq',
                title: 'OSI Model Layers',
                description: 'Which layer of the OSI model is responsible for routing decisions?',
                options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Physical Layer'],
                answer: 1 // Network Layer
            },
            {
                id: 2,
                type: 'mcq',
                title: 'TCP Handshake',
                description: "What is the primary function of TCP's three-way handshake?",
                options: [
                    'To establish a connection and synchronize sequence numbers.',
                    'To acknowledge received data packets.',
                    'To control the flow of data between sender and receiver.',
                    'To manage error detection and retransmission.'
                ],
                answer: 0
            },
            {
                id: 3,
                type: 'mcq',
                title: 'Private IP Ranges',
                description: 'Which of the following is a private IP address range?',
                options: [
                    '11.0.0.0 - 11.255.255.255',
                    '172.16.0.0 - 172.31.255.255',
                    '193.0.0.0 - 193.255.255.255',
                    '200.0.0.0 - 200.255.255.255'
                ],
                answer: 1
            },
            {
                id: 4,
                type: 'mcq',
                title: 'ARP Purpose',
                description: 'What is the purpose of ARP (Address Resolution Protocol)?',
                options: [
                    'To resolve domain names to IP addresses.',
                    'To resolve IP addresses to MAC addresses.',
                    'To resolve MAC addresses to IP addresses.',
                    'To resolve network addresses to physical addresses.'
                ],
                answer: 1
            },
            {
                id: 5,
                type: 'mcq',
                title: 'UDP Scenarios',
                description: 'In what scenario would UDP be preferred over TCP?',
                options: ['File transfer', 'Email transmission', 'DNS queries', 'Web browsing'],
                answer: 2
            }
        ],
        difficulty: 'Medium',
        color: 'from-emerald-500 to-teal-600',
        description: 'Test your knowledge on ISO-OSI layers, TCP/UDP protocols, and network routing.'
    },
    {
        id: 3,
        title: 'Software Engineering Concepts',
        type: 'Written',
        icon: 'FileText',
        duration: '60 mins',
        questions: [
            {
                id: 1,
                type: 'text',
                title: 'SDLC Phases',
                description: 'Briefly explain the main phases of the Software Development Life Cycle (SDLC).'
            },
            {
                id: 2,
                type: 'text',
                title: 'Agile Goals',
                description: 'What is the primary goal of agile methodologies in software development?'
            },
            {
                id: 3,
                type: 'text',
                title: 'Requirements Types',
                description: 'Differentiate between functional and non-functional requirements. Provide an example of each.'
            },
            {
                id: 4,
                type: 'text',
                title: 'Design Patterns',
                description: 'What is a design pattern, and why are they important in software engineering?'
            },
            {
                id: 5,
                type: 'text',
                title: 'Version Control',
                description: 'What is the role of version control systems (e.g., Git) in a software development project?'
            }
        ],
        difficulty: 'Easy',
        color: 'from-amber-500 to-orange-600',
        description: 'Explain SDLC models, design patterns, and agile methodologies in detail.'
    },
    {
        id: 4,
        title: 'Database Management Systems',
        type: 'Mixed',
        icon: 'Code',
        duration: '45 mins',
        questions: [
            {
                id: 1,
                type: 'text',
                title: 'ACID Properties',
                description: 'Explain the concept of ACID properties in the context of database transactions.'
            },
            {
                id: 2,
                type: 'code',
                title: 'SQL Query Challenge',
                description: 'Given the following table EMPLOYEES (employee_id, first_name, last_name, department_id, salary), write a SQL query to find the average salary for each department.'
            },
            {
                id: 3,
                type: 'text',
                title: 'Normalization',
                description: 'What is database normalization? Explain the difference between 1NF and 2NF.'
            },
            {
                id: 4,
                type: 'text',
                title: 'Indexing',
                description: 'Describe the purpose of an index in a database. How does it improve query performance, and what are its potential drawbacks?'
            }
        ],
        difficulty: 'Medium',
        color: 'from-purple-500 to-pink-600',
        description: 'Write SQL queries, normalize schemas, and handle database transactions.'
    },
    {
        id: 5,
        title: 'AI & Machine Learning MCQ',
        type: 'MCQ',
        icon: 'BookOpen',
        duration: '40 mins',
        questions: [
            {
                id: 1,
                type: 'mcq',
                title: 'Activation Functions',
                description: 'Which of the following activation functions is most commonly used in the output layer of a binary classification neural network?',
                options: ['ReLU', 'Sigmoid', 'Tanh', 'Leaky ReLU'],
                answer: 1
            },
            {
                id: 2,
                type: 'mcq',
                title: 'Vanishing Gradient',
                description: 'In the context of neural networks, what is the vanishing gradient problem?',
                options: [
                    'Gradients becoming too large, leading to unstable training.',
                    'Gradients becoming too small, making it difficult for the network to learn.',
                    'The loss function failing to converge during training.',
                    'The network getting stuck in a local minimum.'
                ],
                answer: 1
            },
            {
                id: 3,
                type: 'mcq',
                title: 'Supervised Learning',
                description: 'Which of these is a supervised learning algorithm?',
                options: ['K-Means Clustering', 'Principal Component Analysis (PCA)', 'Support Vector Machine (SVM)', 'Gaussian Mixture Models'],
                answer: 2
            },
            {
                id: 4,
                type: 'mcq',
                title: 'Backpropagation',
                description: 'What is the purpose of backpropagation in a neural network?',
                options: [
                    'To forward propagate input data through the network.',
                    'To calculate the error at the output layer.',
                    'To update the weights and biases of the network based on the error.',
                    'To perform dimensionality reduction.'
                ],
                answer: 2
            },
            {
                id: 5,
                type: 'mcq',
                title: 'Evaluation Metrics',
                description: 'Which metric is most appropriate for evaluating a highly imbalanced binary classification dataset?',
                options: ['Accuracy', 'Precision', 'Recall', 'F1-score'],
                answer: 3
            }
        ],
        difficulty: 'Hard',
        color: 'from-red-500 to-rose-600',
        description: 'Advanced questions on neural networks, backpropagation, and heuristic search.'
    },
    {
        id: 6,
        title: 'Data Science & Python',
        type: 'Applied',
        icon: 'Code',
        duration: '50 mins',
        questions: [
            {
                id: 1,
                type: 'code',
                title: 'Pandas Data Cleaning',
                description: 'Given a DataFrame `df` with columns ["Date", "Sales", "Target"], write a Python function to fill missing sales values with the mean of the department, and calculate a new column "Performance" as Sales/Target.'
            },
            {
                id: 2,
                type: 'code',
                title: 'Model Evaluation Function',
                description: 'Implement a function that takes true labels and predicted probabilities, and returns the Cross-Entropy loss without using external library functions for the calculation.'
            },
            {
                id: 3,
                type: 'text',
                title: 'Bias-Variance Tradeoff',
                description: 'Explain the Bias-Variance tradeoff in the context of model overfitting and underfitting. How does increasing model complexity affect both?'
            }
        ],
        difficulty: 'Medium',
        color: 'from-orange-500 to-red-600',
        description: 'Practical data science tasks including data manipulation and statistical modeling.'
    }
];
