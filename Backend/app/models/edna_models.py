from sqlalchemy import Column, Integer, String, JSON, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class EDNAQuestion(Base):
    """E-DNA quiz questions with branching logic"""
    __tablename__ = "edna_questions"

    id = Column(Integer, primary_key=True)
    question_text = Column(Text, nullable=False)
    # core_type, subtype, learning_style, etc.
    question_type = Column(String(50), nullable=False)
    layer = Column(Integer, nullable=False)  # 1-6 for six-layer profiling
    options = Column(JSON, nullable=False)  # Array of answer options
    # Next question logic based on answers
    branching_logic = Column(JSON, nullable=True)
    order_index = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)


class EDNAResponse(Base):
    """User responses to E-DNA quiz questions"""
    __tablename__ = "edna_responses"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    quiz_session_id = Column(String(100), nullable=False)
    question_id = Column(Integer, ForeignKey(
        "edna_questions.id"), nullable=False)
    selected_option = Column(String(100), nullable=False)
    # Normalized value for scoring
    option_value = Column(String(100), nullable=True)
    # Time taken to answer in milliseconds
    response_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    question = relationship("EDNAQuestion", backref="responses")


class EDNAProfile(Base):
    """Complete six-layer E-DNA profile for users"""
    __tablename__ = "edna_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, unique=True, nullable=False)
    quiz_session_id = Column(String(100), nullable=False)

    # Six-layer profiling
    # Architect, Alchemist, Builder, Visionary
    core_type = Column(String(50), nullable=False)
    core_type_confidence = Column(Float, nullable=False, default=0.0)

    subtype = Column(String(100), nullable=True)
    subtype_confidence = Column(Float, nullable=True, default=0.0)

    # Visual, Auditory, Kinesthetic, etc.
    learning_styles = Column(JSON, nullable=True)
    learning_styles_confidence = Column(Float, nullable=True, default=0.0)

    # ADHD, Dyslexia, Autism, etc.
    neurodiversity = Column(JSON, nullable=True)
    neurodiversity_confidence = Column(Float, nullable=True, default=0.0)

    # Growth, Fixed, Risk tolerance, etc.
    mindset = Column(JSON, nullable=True)
    mindset_confidence = Column(Float, nullable=True, default=0.0)

    # Success definitions, values, etc.
    meta_beliefs = Column(JSON, nullable=True)
    meta_beliefs_confidence = Column(Float, nullable=True, default=0.0)

    # Overall metrics
    overall_confidence = Column(Float, nullable=False, default=0.0)
    completion_percentage = Column(Float, nullable=False, default=0.0)

    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)


class QuizSession(Base):
    """Track quiz sessions and completion status"""
    __tablename__ = "quiz_sessions"

    id = Column(Integer, primary_key=True)
    session_id = Column(String(100), unique=True, nullable=False)
    user_id = Column(Integer, nullable=False)

    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    total_questions = Column(Integer, default=0)
    questions_answered = Column(Integer, default=0)
    questions_skipped = Column(Integer, default=0)

    average_response_time_ms = Column(Float, nullable=True)
    total_time_seconds = Column(Integer, nullable=True)

    is_completed = Column(Boolean, default=False)
    completion_rate = Column(Float, default=0.0)

    # Device and browser info
    device_type = Column(String(50), nullable=True)
    browser_info = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)
