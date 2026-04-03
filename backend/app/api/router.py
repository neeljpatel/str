from fastapi import APIRouter
from app.api.routes.public.endpoints import router as public_router
from app.api.routes.admin.endpoints import router as admin_router
from app.api.routes.public.hospitable import router as public_hospitable_router
from app.api.routes.admin.hospitable import router as admin_hospitable_router
from app.api.routes.public.properties import router as public_properties_router
from app.api.routes.admin.galleries import router as admin_galleries_router

api_router = APIRouter()

api_router.include_router(public_router, prefix="/public", tags=["Public"])
api_router.include_router(public_properties_router, prefix="/public", tags=["Public Properties"])
api_router.include_router(public_hospitable_router, prefix="/public/hospitable", tags=["Public Hospitable"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])
api_router.include_router(admin_galleries_router, prefix="/admin/galleries", tags=["Admin Galleries"])
api_router.include_router(admin_hospitable_router, prefix="/admin/hospitable", tags=["Admin Hospitable"])
