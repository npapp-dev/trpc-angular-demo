import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MindMapNode {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  children?: MindMapNode[];
  expanded?: boolean;
  level: number;
}

@Component({
  selector: 'app-mindmap',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mindmap.component.html',
  styleUrls: ['./mindmap.component.css']
})
export class MindmapComponent implements OnInit {
  mindMapData: MindMapNode[] = [];
  selectedNode: MindMapNode | null = null;
  searchTerm = '';

  ngOnInit() {
    this.initializeMindMap();
  }

  initializeMindMap() {
    this.mindMapData = [
      {
        id: 'trpc-core',
        title: 'tRPC Core Concepts',
        description: 'tRPC (TypeScript Remote Procedure Call) is a framework for building fully type-safe APIs, allowing you to define backend procedures in TypeScript and call them from the frontend with full type inference and validation.',
        icon: '🧠',
        color: '#3b82f6',
        level: 0,
        expanded: true,
        children: [
          {
            id: 'philosophy',
            title: 'Core Philosophy',
            icon: '🎯',
            color: '#10b981',
            level: 1,
            description: 'The guiding principles behind tRPC: type safety, simplicity, and developer experience.',
            children: [
              { id: 'type-safety', title: 'End-to-End Type Safety', icon: '🛡️', level: 2, description: 'Ensures that types are consistent and checked from the backend to the frontend, eliminating many classes of bugs and making refactoring safer.' },
              { id: 'zero-config', title: 'Zero Configuration', icon: '⚡', level: 2, description: 'tRPC works out of the box with minimal setup, requiring no code generation or manual type sharing.' },
              { id: 'dev-experience', title: 'Developer Experience First', icon: '🚀', level: 2, description: 'Focuses on providing a smooth, productive workflow with features like auto-completion, instant feedback, and type inference.' },
              { id: 'full-stack', title: 'Full-Stack TypeScript', icon: '📱', level: 2, description: 'Allows you to use TypeScript for both backend and frontend, sharing types and logic seamlessly.' }
            ]
          },
          {
            id: 'architecture',
            title: 'Architecture Components',
            icon: '🏗️',
            color: '#f59e0b',
            level: 1,
            description: 'The main building blocks of a tRPC application, divided into server-side and client-side components.',
            children: [
              {
                id: 'server-side',
                title: 'Server Side',
                icon: '🖥️',
                level: 2,
                description: 'Defines the API using routers, procedures, and context, and exposes it via an HTTP server.',
                children: [
                  { id: 'router', title: 'Router (t.router)', level: 3, description: 'A router is a collection of related procedures (endpoints) grouped together. Routers can be merged to form a larger API.' },
                  { id: 'procedures', title: 'Procedures (t.procedure)', level: 3, description: 'A procedure is a single endpoint (query or mutation) that can be called from the client. It defines input validation, business logic, and output type.' },
                  { id: 'context', title: 'Context (createContext)', level: 3, description: 'Context is a shared object available to all procedures during a request. It is commonly used for authentication, database access, and per-request data.' },
                  { id: 'middleware', title: 'Middleware (createExpressMiddleware)', level: 3, description: 'Middleware connects tRPC to your HTTP server (like Express) and can be used for cross-cutting concerns such as logging, error handling, or authentication.' }
                ]
              },
              {
                id: 'client-side',
                title: 'Client Side',
                icon: '💻',
                level: 2,
                description: 'The frontend consumes the tRPC API using a type-safe client, with full type inference and auto-completion.',
                children: [
                  { id: 'client-creation', title: 'Client Creation', level: 3, description: 'The tRPC client is created using the API definition from the server, enabling type-safe calls to backend procedures.' },
                  { id: 'type-inference', title: 'Type Inference', level: 3, description: 'Automatically infers the types of inputs and outputs for all procedures, so you never have to manually define them on the client.' },
                  { id: 'hooks', title: 'Query/Mutation Hooks', level: 3, description: 'Provides React/Angular hooks for calling queries and mutations, handling loading and error states.' },
                  { id: 'subscriptions', title: 'Real-time Subscriptions', level: 3, description: 'Supports real-time data updates via subscriptions, allowing the client to react to server-side events.' }
                ]
              }
            ]
          },
          {
            id: 'features',
            title: 'Key Features',
            icon: '🔧',
            color: '#8b5cf6',
            level: 1,
            description: 'The most important features that make tRPC powerful and productive.',
            children: [
              {
                id: 'type-safety-features',
                title: 'Type Safety',
                icon: '🛡️',
                level: 2,
                description: 'Guarantees that your API contracts are always in sync between client and server.',
                children: [
                  { id: 'input-validation', title: 'Input Validation (Zod)', level: 3, description: 'tRPC uses Zod to validate and parse input data, ensuring that only valid data reaches your business logic.' },
                  { id: 'output-inference', title: 'Output Type Inference', level: 3, description: 'The output type of each procedure is inferred from your implementation, so the client always knows what to expect.' },
                  { id: 'error-handling', title: 'Error Handling', level: 3, description: 'tRPC provides structured error handling, allowing you to catch and handle errors gracefully on both server and client.' }
                ]
              },
              {
                id: 'performance',
                title: 'Performance',
                icon: '⚡',
                level: 2,
                description: 'tRPC is designed to be fast and efficient, with features that help optimize API calls.',
                children: [
                  { id: 'batching', title: 'Request Batching', level: 3, description: 'Allows multiple API calls to be batched into a single HTTP request, reducing network overhead.' },
                  { id: 'caching', title: 'Caching', level: 3, description: 'Supports caching of query results to improve performance and reduce server load.' },
                  { id: 'optimistic', title: 'Optimistic Updates', level: 3, description: 'Enables the client to update the UI immediately while waiting for the server response, improving perceived performance.' }
                ]
              },
              {
                id: 'dev-experience-features',
                title: 'Developer Experience',
                icon: '🎨',
                level: 2,
                description: 'tRPC is built for productivity, with features that make development faster and more enjoyable.',
                children: [
                  { id: 'autocomplete', title: 'Auto-completion', level: 3, description: 'TypeScript auto-completion works everywhere, so you always know what inputs and outputs are expected.' },
                  { id: 'type-checking', title: 'Type Checking', level: 3, description: 'Type errors are caught at compile time, not at runtime, making your code safer.' },
                  { id: 'hot-reload', title: 'Hot Reloading', level: 3, description: 'Works seamlessly with hot reloading tools, so you can see changes instantly.' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'multi-router',
        title: 'Multi-Router Architecture',
        description: 'A scalable way to organize your tRPC API by splitting it into multiple domain-specific routers and merging them into a single app router.',
        icon: '🏛️',
        color: '#ef4444',
        level: 0,
        expanded: false,
        children: [
          {
            id: 'router-org',
            title: 'Router Organization',
            icon: '📁',
            color: '#06b6d4',
            level: 1,
            description: 'Routers are grouped by domain (e.g., users, posts, products) to keep code modular and maintainable.',
            children: [
              {
                id: 'domain-routers',
                title: 'Domain-Specific Routers',
                icon: '🎯',
                level: 2,
                description: 'Each domain (users, posts, products, etc.) has its own router file, containing all related procedures.',
                children: [
                  { id: 'user-router', title: 'userRouter.ts', level: 3, description: 'Handles all user-related API procedures, such as creating, updating, and fetching users.' },
                  { id: 'post-router', title: 'postRouter.ts', level: 3, description: 'Handles all post-related API procedures, such as creating, updating, and fetching posts.' },
                  { id: 'product-router', title: 'productRouter.ts', level: 3, description: 'Handles all product-related API procedures, such as creating, updating, and fetching products.' },
                  { id: 'utility-router', title: 'utilityRouter.ts', level: 3, description: 'Handles utility procedures like health checks, error testing, and server info.' }
                ]
              },
              { id: 'main-router', title: 'Main Router (appRouter.ts)', icon: '🔗', level: 2, description: 'The main router merges all domain routers into a single API, namespacing them for clarity.' },
              { id: 'index-file', title: 'Index File (index.ts)', icon: '📄', level: 2, description: 'Centralizes exports of all routers and types for easy imports elsewhere in the codebase.' }
            ]
          },
          {
            id: 'merging-patterns',
            title: 'Router Merging Patterns',
            icon: '🔄',
            color: '#84cc16',
            level: 1,
            description: 'Different ways to combine routers: by namespace, flat merging, or nested merging.',
            children: [
              { id: 'namespace', title: 'Namespace Merging', icon: '🏷️', level: 2, description: 'Each router is added under a unique key (e.g., users, posts), so endpoints are grouped by domain.' },
              { id: 'flat', title: 'Flat Merging', icon: '📋', level: 2, description: 'All procedures are merged at the top level, without namespaces. Not recommended for large APIs.' },
              { id: 'nested', title: 'Nested Merging', icon: '📂', level: 2, description: 'Routers can be nested within each other for more complex, hierarchical APIs.' }
            ]
          },
          {
            id: 'design-patterns',
            title: 'Router Design Patterns',
            icon: '🎨',
            color: '#f97316',
            level: 1,
            description: 'Common patterns for organizing procedures within routers.',
            children: [
              {
                id: 'crud',
                title: 'CRUD Operations',
                icon: '📝',
                level: 2,
                description: 'Create, Read, Update, Delete — the four basic operations for managing resources.',
                children: [
                  { id: 'create', title: 'Create (POST)', level: 3, description: 'Adds a new resource to the system.' },
                  { id: 'read', title: 'Read (GET)', level: 3, description: 'Retrieves one or more resources.' },
                  { id: 'update', title: 'Update (PUT/PATCH)', level: 3, description: 'Modifies an existing resource.' },
                  { id: 'delete', title: 'Delete (DELETE)', level: 3, description: 'Removes a resource from the system.' }
                ]
              },
              {
                id: 'query-patterns',
                title: 'Query Patterns',
                icon: '🔍',
                level: 2,
                description: 'Standard ways to fetch data from the API.',
                children: [
                  { id: 'get-all', title: 'getAll', level: 3, description: 'Fetches all items of a resource.' },
                  { id: 'get-by-id', title: 'getById', level: 3, description: 'Fetches a single item by its unique identifier.' },
                  { id: 'get-by-filter', title: 'getByFilter', level: 3, description: 'Fetches items matching specific criteria.' },
                  { id: 'search', title: 'search', level: 3, description: 'Finds items based on a search term.' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'api-endpoints',
        title: 'API Endpoint Structure',
        description: 'How the API endpoints are organized and accessed in a tRPC application.',
        icon: '🔗',
        color: '#8b5cf6',
        level: 0,
        expanded: false,
        children: [
          {
            id: 'users-endpoints',
            title: 'Users (/trpc/users/)',
            icon: '👥',
            color: '#3b82f6',
            level: 1,
            description: 'Endpoints for managing users, such as creating, updating, and searching users.',
            children: [
              { id: 'users-get-all', title: 'GET /users/getAll', level: 2, description: 'Fetches all users from the system.' },
              { id: 'users-get-by-id', title: 'GET /users/getById', level: 2, description: 'Fetches a user by their unique ID.' },
              { id: 'users-create', title: 'POST /users/create', level: 2, description: 'Creates a new user.' },
              { id: 'users-update', title: 'PUT /users/update', level: 2, description: 'Updates an existing user.' },
              { id: 'users-delete', title: 'DELETE /users/delete', level: 2, description: 'Deletes a user.' },
              { id: 'users-search', title: 'GET /users/search', level: 2, description: 'Searches for users by name or other criteria.' }
            ]
          },
          {
            id: 'posts-endpoints',
            title: 'Posts (/trpc/posts/)',
            icon: '📝',
            color: '#10b981',
            level: 1,
            description: 'Endpoints for managing posts, including creating, updating, and searching posts.',
            children: [
              { id: 'posts-get-all', title: 'GET /posts/getAll', level: 2, description: 'Fetches all posts, including user information.' },
              { id: 'posts-get-by-id', title: 'GET /posts/getById', level: 2, description: 'Fetches a post by its unique ID.' },
              { id: 'posts-get-by-user', title: 'GET /posts/getByUserId', level: 2, description: 'Fetches all posts by a specific user.' },
              { id: 'posts-create', title: 'POST /posts/create', level: 2, description: 'Creates a new post.' },
              { id: 'posts-update', title: 'PUT /posts/update', level: 2, description: 'Updates an existing post.' },
              { id: 'posts-delete', title: 'DELETE /posts/delete', level: 2, description: 'Deletes a post.' },
              { id: 'posts-search', title: 'GET /posts/search', level: 2, description: 'Searches for posts by title or content.' }
            ]
          },
          {
            id: 'products-endpoints',
            title: 'Products (/trpc/products/)',
            icon: '🛍️',
            color: '#f59e0b',
            level: 1,
            description: 'Endpoints for managing products, including filtering and searching.',
            children: [
              { id: 'products-get-all', title: 'GET /products/getAll', level: 2, description: 'Fetches all products.' },
              { id: 'products-get-by-id', title: 'GET /products/getById', level: 2, description: 'Fetches a product by its unique ID.' },
              { id: 'products-create', title: 'POST /products/create', level: 2, description: 'Creates a new product.' },
              { id: 'products-update', title: 'PUT /products/update', level: 2, description: 'Updates an existing product.' },
              { id: 'products-delete', title: 'DELETE /products/delete', level: 2, description: 'Deletes a product.' },
              { id: 'products-by-category', title: 'GET /products/getByCategory', level: 2, description: 'Fetches products by category.' },
              { id: 'products-in-stock', title: 'GET /products/getInStock', level: 2, description: 'Fetches only products that are in stock.' },
              { id: 'products-search', title: 'GET /products/search', level: 2, description: 'Searches for products by name.' },
              { id: 'products-price-range', title: 'GET /products/getByPriceRange', level: 2, description: 'Fetches products within a specific price range.' }
            ]
          }
        ]
      },
      {
        id: 'learning-path',
        title: 'Learning Path',
        description: 'A step-by-step guide to mastering tRPC, from beginner to advanced topics.',
        icon: '🎓',
        color: '#06b6d4',
        level: 0,
        expanded: false,
        children: [
          {
            id: 'beginner',
            title: 'Beginner Level',
            icon: '🌱',
            color: '#10b981',
            level: 1,
            description: 'Start here if you are new to tRPC or type-safe APIs.',
            children: [
              {
                id: 'basic-concepts',
                title: 'Basic Concepts',
                icon: '📚',
                level: 2,
                description: 'Learn what tRPC is, why type safety matters, and how to set up your first project.',
                children: [
                  { id: 'what-is-trpc', title: 'What is tRPC?', level: 3, description: 'tRPC is a framework for building fully type-safe APIs in TypeScript, allowing you to call backend procedures from the frontend with full type inference.' },
                  { id: 'type-safety-benefits', title: 'Type safety benefits', level: 3, description: 'Type safety ensures that your code is less error-prone, easier to refactor, and more maintainable.' },
                  { id: 'setup-config', title: 'Setup and configuration', level: 3, description: 'Setting up tRPC involves installing the package, creating routers and procedures, and connecting to your HTTP server.' }
                ]
              },
              {
                id: 'simple-router',
                title: 'Simple Router',
                icon: '🔧',
                level: 2,
                description: 'Create your first router and procedure, and connect it to your frontend.',
                children: [
                  { id: 'create-router', title: 'Create basic router', level: 3, description: 'A basic router groups related procedures together. Example: a userRouter for all user-related endpoints.' },
                  { id: 'define-procedures', title: 'Define procedures', level: 3, description: 'Procedures are the endpoints of your API. Define them using t.procedure, specifying input validation and business logic.' },
                  { id: 'connect-express', title: 'Connect to Express', level: 3, description: 'Use createExpressMiddleware to connect your tRPC API to an Express server.' }
                ]
              }
            ]
          },
          {
            id: 'intermediate',
            title: 'Intermediate Level',
            icon: '🚀',
            color: '#f59e0b',
            level: 1,
            description: 'For those who understand the basics and want to build more complex APIs.',
            children: [
              {
                id: 'advanced-patterns',
                title: 'Advanced Router Patterns',
                icon: '🎯',
                level: 2,
                description: 'Learn how to organize large APIs using multiple routers and namespaces.',
                children: [
                  { id: 'multiple-routers', title: 'Multiple routers', level: 3, description: 'Split your API into multiple routers by domain for better organization and maintainability.' },
                  { id: 'router-merging', title: 'Router merging', level: 3, description: 'Combine multiple routers into a single app router using t.router().' },
                  { id: 'namespace-org', title: 'Namespace organization', level: 3, description: 'Namespace your routers (e.g., users, posts) to keep endpoints organized.' }
                ]
              },
              {
                id: 'real-world',
                title: 'Real-world Patterns',
                icon: '🌍',
                level: 2,
                description: 'Apply tRPC to real-world scenarios, including authentication and database integration.',
                children: [
                  { id: 'crud-operations', title: 'CRUD operations', level: 3, description: 'Implement Create, Read, Update, Delete operations for your resources.' },
                  { id: 'authentication', title: 'Authentication', level: 3, description: 'Add authentication to your API using context and middleware.' },
                  { id: 'database-integration', title: 'Database integration', level: 3, description: 'Connect your procedures to a database for persistent storage.' }
                ]
              }
            ]
          },
          {
            id: 'advanced',
            title: 'Advanced Level',
            icon: '🎯',
            color: '#ef4444',
            level: 1,
            description: 'Master tRPC with advanced features and production best practices.',
            children: [
              {
                id: 'performance',
                title: 'Performance Optimization',
                icon: '⚡',
                level: 2,
                description: 'Make your API fast and scalable with caching, batching, and database optimization.',
                children: [
                  { id: 'caching-strategies', title: 'Caching strategies', level: 3, description: 'Cache query results to reduce server load and improve response times.' },
                  { id: 'request-batching', title: 'Request batching', level: 3, description: 'Batch multiple API calls into a single request for efficiency.' },
                  { id: 'database-optimization', title: 'Database optimization', level: 3, description: 'Optimize your database queries for speed and scalability.' }
                ]
              },
              {
                id: 'production',
                title: 'Production Deployment',
                icon: '🚀',
                level: 2,
                description: 'Deploy your tRPC API to production with security, monitoring, and scaling in mind.',
                children: [
                  { id: 'security', title: 'Security considerations', level: 3, description: 'Validate all inputs, use authentication, and protect against common vulnerabilities.' },
                  { id: 'monitoring', title: 'Monitoring and logging', level: 3, description: 'Monitor your API for errors and performance issues.' },
                  { id: 'scaling', title: 'Scaling strategies', level: 3, description: 'Scale your API horizontally or vertically to handle more traffic.' }
                ]
              }
            ]
          }
        ]
      }
    ];
  }

  toggleNode(node: MindMapNode) {
    node.expanded = !node.expanded;
  }

  selectNode(node: MindMapNode) {
    this.selectedNode = node;
  }

  getFilteredNodes(): MindMapNode[] {
    if (!this.searchTerm) {
      return this.mindMapData;
    }
    return this.filterNodes(this.mindMapData, this.searchTerm.toLowerCase());
  }

  private filterNodes(nodes: MindMapNode[], searchTerm: string): MindMapNode[] {
    return nodes.filter(node => {
      const matches = node.title.toLowerCase().includes(searchTerm) ||
                     (node.description && node.description.toLowerCase().includes(searchTerm));
      
      if (node.children) {
        const filteredChildren = this.filterNodes(node.children, searchTerm);
        if (filteredChildren.length > 0) {
          node.children = filteredChildren;
          return true;
        }
      }
      
      return matches;
    });
  }

  getNodeClass(node: MindMapNode): string {
    const baseClass = 'mindmap-node';
    const levelClass = `level-${node.level}`;
    const colorClass = node.color ? `color-${node.color.replace('#', '')}` : '';
    return `${baseClass} ${levelClass} ${colorClass}`.trim();
  }

  getNodeStyle(node: MindMapNode): any {
    if (node.color) {
      return {
        'border-left-color': node.color,
        'background-color': `${node.color}10`
      };
    }
    return {};
  }
} 