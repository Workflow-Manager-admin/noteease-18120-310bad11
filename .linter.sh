#!/bin/bash
cd /home/kavia/workspace/code-generation/noteease-18120-310bad11/note_ease
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

