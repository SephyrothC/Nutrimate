from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO
from typing import Any
from app.models.shopping_list import ShoppingList

class PDFGenerator:
    @staticmethod
    def generate_shopping_list_pdf(shopping_list: ShoppingList) -> bytes:
        """Génère un PDF pour une liste de courses"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#8B5CF6')  # Violet
        )
        
        heading_style = ParagraphStyle(
            'CategoryHeading',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            textColor=colors.HexColor('#374151')  # Gris foncé
        )
        
        # Contenu
        story = []
        
        # Titre
        title = Paragraph("🛒 Liste de Courses - NutriMate", title_style)
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Date de génération
        date_text = f"Générée le : {shopping_list.generated_at.strftime('%d/%m/%Y à %H:%M')}"
        date_para = Paragraph(date_text, styles['Normal'])
        story.append(date_para)
        story.append(Spacer(1, 20))
        
        # Organiser par catégories
        categories = {}
        for item in shopping_list.items:
            category = item.get("category", "Autres")
            if category not in categories:
                categories[category] = []
            categories[category].append(item)
        
        # Afficher chaque catégorie
        for category, items in categories.items():
            # Titre de catégorie
            category_title = Paragraph(f"📦 {category}", heading_style)
            story.append(category_title)
            
            # Table des items
            table_data = []
            for item in items:
                checkbox = "☑️" if item.get("checked", False) else "☐"
                table_data.append([
                    checkbox,
                    item["name"],
                    item["quantity"]
                ])
            
            if table_data:
                table = Table(table_data, colWidths=[0.5*inch, 3*inch, 1.5*inch])
                table.setStyle(TableStyle([
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('LEFTPADDING', (0, 0), (-1, -1), 6),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                    ('TOPPADDING', (0, 0), (-1, -1), 4),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ]))
                story.append(table)
            
            story.append(Spacer(1, 15))
        
        # Footer
        footer_text = "Généré par NutriMate - Votre assistant alimentaire intelligent"
        footer = Paragraph(footer_text, styles['Italic'])
        story.append(Spacer(1, 30))
        story.append(footer)
        
        # Construire le PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()