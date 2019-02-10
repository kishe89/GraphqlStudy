import { Router, Request, Response } from "express";

const router: Router = Router();
router.get('/', (req: Request, res: Response, next: any) => {
  res.status(200).send("blahblah");
});

export const UserController: Router = router;