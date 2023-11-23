import NotesService from '../services/notesService.js';
import createApiResponse from '../utils/apiResponse.js';
import {
  notesCreateSchema,
  paginationSchema,
  notesUpdateSchema,
} from '../validations/notesValidation.js';
import cleanValidationError from '../utils/cleanValidationError.js';

// Create a transaction
async function createNote(req, res) {
  try {
    const { error, value: note } = notesCreateSchema.validate(req.body);
    if (error) {
      const response = createApiResponse(
        'error',
        null,
        'Validation failed',
        cleanValidationError(error)
      );
      return res.status(400).json(response);
    }

    const newNote = await NotesService.createNote({
      ...note,
      userId: req.user.id,
    });

    const response = createApiResponse('success', newNote, null, null);
    res.status(201).json(response);
  } catch (error) {
    console.error('error', error);

    const response = createApiResponse(
      'error',
      null,
      'Internal server error',
      error.message
    );
    res.status(500).json(response);
  }
}

// Request a list of all notes
async function getAllNotes(req, res) {
  try {
    const { error, value } = paginationSchema.validate(req.query);

    if (error) {
      console.error('error', error);
      const response = createApiResponse(
        'error',
        null,
        'Validation failed',
        cleanValidationError(error)
      );
      return res.status(400).json(response);
    }

    const { page, pageSize, sortByDate } = value;

    const notes = await NotesService.getAllNotes({
      page,
      pageSize,
      sortByDate,
      whereClause: { userId: req.user.id },
    });

    const response = createApiResponse('success', notes, null, null);
    res.status(200).json(response);
  } catch (error) {
    console.error('error', error);

    const response = createApiResponse(
      'error',
      null,
      'Internal server error',
      error.message
    );
    res.status(500).json(response);
  }
}

// Request a note by id
async function getNoteById(req, res) {
  try {
    const { id } = req.params;

    const note = await NotesService.getNoteById({
      whereClause: { userId: req.user.id, id },
    });

    if (!note) {
      const response = createApiResponse('error', null, null, 'Note not found');
      return res.status(404).json(response);
    }

    const response = createApiResponse('success', note, null, null);
    res.status(200).json(response);
  } catch (error) {
    console.error('error', error);

    const response = createApiResponse(
      'error',
      null,
      'Internal server error',
      error.message
    );
    res.status(500).json(response);
  }
}

// Update a note
async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { error, value: note } = notesUpdateSchema.validate(req.body);
    if (error) {
      const response = createApiResponse(
        'error',
        null,
        'Validation failed',
        cleanValidationError(error)
      );
      return res.status(400).json(response);
    }

    const updatedNote = await NotesService.updateNote({
      id,
      note,
      userId: req.user.id,
    });

    const response = createApiResponse('success', updatedNote, null, null);
    res.status(200).json(response);
  } catch (error) {
    console.error('error', error);

    if (error.message == 'NOTE_NOT_FOUND') {
      const response = createApiResponse('error', null, null, 'Note not found');
      return res.status(404).json(response);
    }

    const response = createApiResponse(
      'error',
      null,
      'Internal server error',
      error.message
    );
    res.status(500).json(response);
  }
}

// Delete a note
async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    const deletedNote = await NotesService.deleteNote({
      id,
      userId: req.user.id,
    });

    const response = createApiResponse('success', null, deletedNote, null);
    res.status(200).json(response);
  } catch (error) {
    console.error('error', error);

    if (error.message == 'NOTE_NOT_FOUND') {
      const response = createApiResponse('error', null, null, 'Note not found');
      return res.status(404).json(response);
    }

    const response = createApiResponse(
      'error',
      null,
      'Internal server error',
      error.message
    );
    res.status(500).json(response);
  }
}

export { createNote, getAllNotes, getNoteById, updateNote, deleteNote };
