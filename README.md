## Assignment Cloud App Development
__Name:__ Amy Comyns Haugh

### Links
__Demo:__ 

### Screenshots

API Gateway showing all endpoints:
<img width="1568" height="698" alt="image" src="https://github.com/user-attachments/assets/82a0584c-9377-4f7f-8973-0d42060238b6" />

DynamoDB seeded table with 15 items including movies, actors and roles:
<img width="1880" height="811" alt="image" src="https://github.com/user-attachments/assets/6f4e9f2b-a807-40c3-9a77-893aab2f50f6" />

Route53 hosted zone for amycomynshaugh.lol : 
<img width="1918" height="815" alt="image" src="https://github.com/user-attachments/assets/3b53ffd2-72b7-43b0-95a0-033b90ee9203" />

### Design Features 
Lambda Layers: A shared Lambda layer was created containing the `createDDbDocClient` utility function. This layer is attached to all three Lambda functions (getMovieRoles, getActorBio, addMovieRole), eliminating code duplication and following AWS best practices for serverless architecture.

### Extra 
- Amazon Translate used to translate actor bios and role descriptions into any supported language via the `?language=code` query parameter
- Custom domain `amycomynshaugh.lol` registered on Porkbun, managed via Route 53 with an ACM SSL certificate attached to CloudFront
- React TypeScript frontend hosted on S3 and served via CloudFront CDN

### How to Run App
- cdk deploy
- copy API URL from outputs and paste in config.ts
- cd frontend
- npm run build
- cd ..
- cdk deploy
  



