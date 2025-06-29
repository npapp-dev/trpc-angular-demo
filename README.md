# 🚀 tRPC + Angular + RxJS Demo

A comprehensive demonstration of integrating tRPC with Angular using RxJS observables, featuring a full-stack application with modern patterns and best practices.

## 🤖 AI Assistance

This project was created with assistance from AI tools (Claude/GPT) for educational purposes. The code has been reviewed, modified, and customized by the author to provide a comprehensive learning resource for developers interested in tRPC, Angular, and RxJS integration.

## 🎯 Learning Objectives

- **tRPC Integration**: Learn how to integrate tRPC with Angular applications
- **RxJS Patterns**: Understand reactive programming patterns with observables
- **Type Safety**: Experience end-to-end type safety with TypeScript and Zod
- **Error Handling**: Implement robust error handling with RxJS
- **State Management**: Manage application state using RxJS observables
- **Modern Angular**: Use Angular 17 standalone components and modern patterns

## 🏗️ Project Structure

```
trpc-angular-demo/
├── server/                 # tRPC backend server
│   ├── src/
│   │   ├── router.ts      # tRPC router with procedures
│   │   └── server.ts      # Express server setup
│   ├── package.json       # Server dependencies
│   └── tsconfig.json      # TypeScript config
├── src/
│   ├── app/
│   │   ├── components/    # Angular components
│   │   │   ├── home/      # Home page with greeting demo
│   │   │   ├── users/     # CRUD operations demo
│   │   │   ├── posts/     # Related data demo
│   │   │   └── demo/      # Advanced features demo
│   │   ├── services/      # tRPC service
│   │   ├── shared/        # Shared types and interfaces
│   │   └── app.routes.ts  # Application routing
│   └── main.ts            # Application entry point
└── package.json           # Frontend dependencies
```

## 🚀 Features

### **Frontend (Angular 17)**
- ✅ Standalone components with modern Angular patterns
- ✅ Reactive forms and template-driven forms
- ✅ Comprehensive error handling and loading states
- ✅ Responsive design with CSS Grid and Flexbox
- ✅ Type-safe API calls with tRPC

### **Backend (tRPC + Express)**
- ✅ Type-safe API with tRPC procedures
- ✅ Input validation with Zod schemas
- ✅ CORS enabled for Angular frontend
- ✅ Sample data for users and posts
- ✅ Error handling and custom procedures

### **Advanced Features**
- ✅ **Error Handling Demo**: Test success and error scenarios
- ✅ **Slow Query Demo**: Customizable delays with loading states
- ✅ **Reactive Patterns**: Periodic API calls with RxJS operators
- ✅ **Batch Operations**: Sequential vs parallel execution
- ✅ **Loading States**: Real-time loading indicators

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Angular 17 (Standalone Components)
- **State Management**: RxJS Observables
- **Type Safety**: TypeScript
- **Styling**: CSS3 with Grid/Flexbox
- **HTTP Client**: Fetch API with RxJS

### **Backend**
- **Runtime**: Node.js with Express
- **API**: tRPC with type-safe procedures
- **Validation**: Zod schemas
- **CORS**: Cross-origin resource sharing
- **TypeScript**: Full type safety

### **Development Tools**
- **Package Manager**: npm
- **Build Tool**: Angular CLI
- **Development Server**: Angular dev server + Express
- **Type Checking**: TypeScript compiler

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v18 or higher)
- npm (v8 or higher)

### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd trpc-angular-demo
```

### **2. Install Dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### **3. Start the Backend Server**
```bash
cd server
npm run dev
```

The tRPC server will start on `http://localhost:3001`

### **4. Start the Angular Application**
```bash
# In a new terminal
npm start
```

The Angular app will start on `http://localhost:4200`

## 🎮 Usage

### **Home Page**
- Test basic tRPC greeting functionality
- View feature overview and technical stack

### **Users Management**
- Create, read, and update users
- Inline editing capabilities
- Form validation and error handling

### **Posts with Users**
- View posts with associated user information
- Statistics and data visualization
- Related data fetching

### **Advanced Demo**
- **Error Handling**: Test success and error scenarios
- **Slow Queries**: Customizable delays (100ms - 10s)
- **Reactive Patterns**: Periodic API calls every 2 seconds
- **Batch Operations**: Sequential vs parallel execution
- **Loading States**: Real-time loading indicators

## 🔧 API Endpoints

### **Queries**
- `greeting` - Get a greeting message
- `getUsers` - Get all users
- `getUserById` - Get user by ID
- `getPosts` - Get posts with user information
- `getUserWithError` - Test error handling
- `slowQuery` - Simulate slow responses

### **Mutations**
- `createUser` - Create a new user
- `updateUser` - Update existing user

## 📚 Key Learning Concepts

### **tRPC Integration**
```typescript
// Service method example
getUsers(): Observable<User[]> {
  return this.makeRequest<User[]>('getUsers');
}
```

### **RxJS Patterns**
```typescript
// Error handling with RxJS
this.trpcService.getUsers().pipe(
  catchError(error => {
    this.error = error.message;
    return EMPTY;
  })
).subscribe(users => {
  this.users = users;
});
```

### **Type Safety**
```typescript
// Shared types across frontend and backend
export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}
```

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues
- Suggest improvements

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **tRPC Team** for the amazing type-safe API framework
- **Angular Team** for the excellent framework and tooling
- **RxJS Team** for reactive programming patterns
- **AI Tools** for initial code generation assistance

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the code comments for detailed explanations
- Review the tRPC and Angular documentation

---

**Happy coding! 🎉**
